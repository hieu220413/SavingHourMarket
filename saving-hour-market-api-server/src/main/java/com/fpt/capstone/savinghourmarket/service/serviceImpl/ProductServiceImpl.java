package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.*;
import com.fpt.capstone.savinghourmarket.entity.*;
import com.fpt.capstone.savinghourmarket.exception.InvalidExcelFileDataException;
import com.fpt.capstone.savinghourmarket.exception.InvalidInputException;
import com.fpt.capstone.savinghourmarket.exception.ItemNotFoundException;
import com.fpt.capstone.savinghourmarket.exception.ResourceNotFoundException;
import com.fpt.capstone.savinghourmarket.model.*;
import com.fpt.capstone.savinghourmarket.repository.*;
import com.fpt.capstone.savinghourmarket.service.FirebaseService;
import com.fpt.capstone.savinghourmarket.service.ProductCategoryService;
import com.fpt.capstone.savinghourmarket.service.ProductService;
import com.fpt.capstone.savinghourmarket.service.ProductSubCategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.*;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final ProductSubCategoryRepository productSubCategoryRepository;
    private final SupermarketRepository supermarketRepository;
    private final ProductCategoryService productCategoryService;
    private final ProductSubCategoryService productSubCategoryService;
    private final PickupPointRepository pickupPointRepository;
    private final ProductBatchRepository productBatchRepository;
    private final SupermarketAddressRepository supermarketAddressRepository;

    private final OrderRepository orderRepository;

    @Override
    public ProductListResponseBody getProductsForStaff(String name, String supermarketId, String productCategoryId, String productSubCategoryId, EnableDisableStatus status, Integer page, Integer limit, SortType quantitySortType, SortType expiredSortType, SortType priceSort, boolean isHiddenBatchShown) {
//        Sort sortable = Sort.by("expiredDate").ascending();
//        if(quantitySortType.equals("ASC") ){
//            sortable = Sort.by("expiredDate").ascending();
//        }else if (quantitySortType.equals("DESC")) {
//            sortable = Sort.by("expiredDate").ascending();
//        }else if (quantitySortType.equals("ASC")){
//            sortable = Sort.by("expiredDate").ascending();
//        }else {
//            sortable = Sort.by("expiredDate").descending();
//        }

//        if (quantitySortType != null) {
//            sortable = quantitySortType.toString().equals("ASC") ? Sort.by("quantity").ascending() : Sort.by("quantity").descending();
//        }
//
//        if (priceSort != null) {
//            sortable = priceSort.toString().equals("ASC") ? Sort.by("price").ascending() : Sort.by("price").descending();
//        }
//
//        if (expiredSortType != null) {
//            sortable = expiredSortType.toString().equals("ASC") ? Sort.by("expiredDate").ascending() : Sort.by("expiredDate").descending();
//        }

        Pageable pageableWithSort = PageRequest.of(page, limit);
        Page<Product> result = productRepository.getProductsForStaff(supermarketId == null ? null : UUID.fromString(supermarketId)
                , name
                , productCategoryId == null ? null : UUID.fromString(productCategoryId)
                , productSubCategoryId == null ? null : UUID.fromString(productSubCategoryId)
                , status == null ? EnableDisableStatus.ENABLE.ordinal() : status.ordinal()
                , isHiddenBatchShown
//                , isExpiredShown
                , pageableWithSort);

        int totalPage = result.getTotalPages();
        long totalProduct = result.getTotalElements();

        List<Product> productList = result.stream().toList();
        List<ProductDisplayStaff> productDisplayStaffList = productList.stream().map(ProductDisplayStaff::new).collect(Collectors.toList());
        HashMap<UUID, ProductDisplayStaff> productDisplayStaffHashMap = new HashMap<>();
        productDisplayStaffList.forEach(productDisplayStaff -> productDisplayStaffHashMap.put(productDisplayStaff.getId(), productDisplayStaff));

        for (Product product : productList) {
            HashMap<LocalDate, ProductBatchDisplayStaff> sameExpiredDateTrack = new HashMap<>();
            for (ProductBatch productBatch : product.getProductBatchList()) {
                if (!sameExpiredDateTrack.containsKey(productBatch.getExpiredDate())) {
                    sameExpiredDateTrack.put(productBatch.getExpiredDate(), new ProductBatchDisplayStaff(productBatch));
                } else {
                    sameExpiredDateTrack.get(productBatch.getExpiredDate()).getProductBatchAddressDisplayStaffList().add(new ProductBatchAddressDisplayStaff(productBatch));
                }
            }
            productDisplayStaffHashMap.get(product.getId()).setProductBatchDisplayStaffList(sameExpiredDateTrack.values().stream().collect(Collectors.toList()));
        }


        return new ProductListResponseBody(productDisplayStaffList, totalPage, totalProduct);
    }

//    @Override
//    public ProductListCustomerResponseBody getProductsForCustomer(String name, String supermarketId, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, SortType quantitySortType, SortType expiredSortType, SortType priceSort, UUID pickupPointId) {
//
//        if(!pickupPointRepository.findById(pickupPointId).isPresent()){
//            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.PICKUP_POINT_NOT_FOUND.getCode()), AdditionalResponseCode.PICKUP_POINT_NOT_FOUND.toString());
//        }
//
//        Sort sortable = Sort.by("productBatchList.expiredDate").ascending();
//
//        if (quantitySortType != null) {
////            sortable = quantitySortType.toString().equals("ASC") ? Sort.by("productBatchList_quantity").ascending() : Sort.by("productBatchList_quantity").descending();
//
//        }
//
//        if (priceSort != null) {
////            sortable = priceSort.toString().equals("ASC") ? Sort.by("productBatchList_price").ascending() : Sort.by("productBatchList_price").descending();
//        }
//
//        if (expiredSortType != null) {
////            sortable = expiredSortType.toString().equals("ASC") ? Sort.by("productBatchList_expiredDate").ascending() : Sort.by("productBatchList_expiredDate").descending();
//        }
//
////        Pageable pageableWithSort = PageRequest.of(page, limit, sortable);
//        Pageable pageableWithSort = PageRequest.of(page, limit, sortable);
//
//        Page<Product> result = productRepository.getProductsForCustomer(supermarketId == null ? null : UUID.fromString(supermarketId)
//                , name
//                , productCategoryId == null ? null : UUID.fromString(productCategoryId)
//                , productSubCategoryId == null ? null : UUID.fromString(productSubCategoryId)
//                , pickupPointId
//                , pageableWithSort);
//
//        int totalPage = result.getTotalPages();
//        long totalProduct = result.getTotalElements();
//
//        List<Product> productList = result.stream().toList();
//
//        HashMap<UUID ,ProductDisplayCustomer> productDisplayCustomerHashMap = new HashMap<>();
//
//
//        for (Product product : productList) {
//            productDisplayCustomerHashMap.put(product.getId(), new ProductDisplayCustomer(product));
//        }
//
//        for (Product product : productList) {
//            HashMap<String, ProductBatchDisplayCustomer> similarBatchTrackingHashmap = new HashMap<>();
//            for (ProductBatch productBatch : product.getProductBatchList()) {
//                if(similarBatchTrackingHashmap.containsKey(productBatch.getExpiredDate().toString())){
//                    // add id to same expired date batch
//                   similarBatchTrackingHashmap.get(productBatch.getExpiredDate().toString()).getIdList().add(productBatch.getId());
//                    // add quantity to same expired date batch
//                   similarBatchTrackingHashmap.get(productBatch.getExpiredDate().toString()).setQuantity(similarBatchTrackingHashmap.get(productBatch.getExpiredDate().toString()).getQuantity() + productBatch.getQuantity());
//                } else {
//                    similarBatchTrackingHashmap.put(productBatch.getExpiredDate().toString(), new ProductBatchDisplayCustomer(productBatch));
//                }
//            }
//            // sort batch with expired date
//            List<ProductBatchDisplayCustomer> productBatchDisplayCustomerList = similarBatchTrackingHashmap.values().stream().collect(Collectors.toList());
//            productBatchDisplayCustomerList.sort((o1, o2) -> o1.getExpiredDate().compareTo(o2.getExpiredDate()));
//            productDisplayCustomerHashMap.get(product.getId()).setProductBatchList(productBatchDisplayCustomerList);
//        }
//
////        List<ProductDisplayCustomer> productDisplayCustomerList = productDisplayCustomerHashMap.values().stream().collect(Collectors.toList());
//        // sort by expired date
//
////        if (quantitySortType != null) {
//////            sortable = quantitySortType.toString().equals("ASC") ? Sort.by("productBatchList_quantity").ascending() : Sort.by("productBatchList_quantity").descending();
////            productDisplayCustomerList.sort((o1, o2) -> quantitySortType.toString().equals("ASC") ?
////                    o1.getProductBatchList().get(0).getQuantity().compareTo(o2.getProductBatchList().get(0).getQuantity())
////                    : o2.getProductBatchList().get(0).getQuantity().compareTo(o1.getProductBatchList().get(0).getQuantity()));
////
////        }
////
////        if (priceSort != null) {
//////            sortable = priceSort.toString().equals("ASC") ? Sort.by("productBatchList_price").ascending() : Sort.by("productBatchList_price").descending();
////            productDisplayCustomerList.sort((o1, o2) -> priceSort.toString().equals("ASC") ?
////                    o1.getProductBatchList().get(0).getPrice().compareTo(o2.getProductBatchList().get(0).getPrice())
////                    : o2.getProductBatchList().get(0).getPrice().compareTo(o1.getProductBatchList().get(0).getPrice()));
////
////        }
//
////        if (expiredSortType != null) {
////            productDisplayCustomerList.sort((o1, o2) -> expiredSortType.toString().equals("ASC") ?
////                    o1.getProductBatchList().get(0).getExpiredDate().compareTo(o2.getProductBatchList().get(0).getExpiredDate())
////                    : o2.getProductBatchList().get(0).getExpiredDate().compareTo(o1.getProductBatchList().get(0).getExpiredDate()));
////        }
////
////        if(expiredSortType == null && priceSort == null && quantitySortType == null) {
////            productDisplayCustomerList.sort((o1, o2) -> o1.getProductBatchList().get(0).getExpiredDate().compareTo(o2.getProductBatchList().get(0).getExpiredDate()));
////
////        }
//
//        return new ProductListCustomerResponseBody(productDisplayCustomerHashMap.values().stream().collect(Collectors.toList()), totalPage, totalProduct);
//    }


    @Override
    public ProductListCustomerResponseBody getProductsForCustomer(String name, String supermarketId, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, SortType quantitySortType, SortType expiredSortType, SortType priceSort, UUID pickupPointId) {

        if (!pickupPointRepository.findById(pickupPointId).isPresent()) {
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.PICKUP_POINT_NOT_FOUND.getCode()), AdditionalResponseCode.PICKUP_POINT_NOT_FOUND.toString());
        }

        Sort sortable = Sort.by("expiredDate").ascending();

//        if (quantitySortType != null) {
//            sortable = quantitySortType.toString().equals("ASC") ? Sort.by("quantity").ascending() : Sort.by("quantity").descending();
//
//        }

        if (priceSort != null) {
            sortable = priceSort.toString().equals("ASC") ? Sort.by("price").ascending() : Sort.by("price").descending();
        }

        if (expiredSortType != null) {
            sortable = expiredSortType.toString().equals("ASC") ? Sort.by("expiredDate").ascending() : Sort.by("expiredDate").descending();
        }

        Pageable pageableWithSort = PageRequest.of(page, limit, sortable);

        Page<Object[]> result = productRepository.getProductsNearestExpiredBatchForCustomer(supermarketId == null ? null : UUID.fromString(supermarketId)
                , name
                , productCategoryId == null ? null : UUID.fromString(productCategoryId)
                , productSubCategoryId == null ? null : UUID.fromString(productSubCategoryId)
                , pickupPointId
                , pageableWithSort);

        int totalPage = result.getTotalPages();
        long totalProduct = result.getTotalElements();

        List<ProductDisplayCustomer> productDisplayCustomerList = new ArrayList<>();
        HashMap<UUID, ProductDisplayCustomer> productDisplayCustomerHashMap = new HashMap<>();

        // get product sort with nearest product batch (no grouping id)
        for (Object[] objects : result) {
            LocalDate nearestBatchExpiredDate = (LocalDate) objects[0];
            Integer nearestBatchPrice = (Integer) objects[1];
            Integer nearestBatchPriceOriginal = (Integer) objects[2];
            Product nearestBatchProduct = (Product) objects[3];
//            Long nearestBatchTotalQuantity = (Long) objects[4];

            ProductDisplayCustomer productDisplayCustomerTemp = new ProductDisplayCustomer(nearestBatchExpiredDate, nearestBatchPrice
                    , nearestBatchPriceOriginal, nearestBatchProduct);
            productDisplayCustomerList.add(productDisplayCustomerTemp);
            productDisplayCustomerHashMap.put(productDisplayCustomerTemp.getId(), productDisplayCustomerTemp);
        }

        // sort by quantity
//        if (quantitySortType != null) {
//            productDisplayCustomerList.sort((o1, o2) -> quantitySortType.toString().equals("ASC")? o1.getNearestExpiredBatch().getQuantity().compareTo(o2.getNearestExpiredBatch().getQuantity())
//                    : o2.getNearestExpiredBatch().getQuantity().compareTo(o1.getNearestExpiredBatch().getQuantity()));
//        }

        List<UUID> productIdTargetList = productDisplayCustomerList.stream().map(productDisplayCustomer -> productDisplayCustomer.getId()).collect(Collectors.toList());

        List<Product> productWithAvailableBatch = productRepository.findProductWithAvailableBatch(productIdTargetList, pickupPointId);

        for (Product product : productWithAvailableBatch) {
            ProductDisplayCustomer productDisplayCustomerTemp = productDisplayCustomerHashMap.get(product.getId());
            // hashmap use to group batch id
            HashMap<LocalDate, ProductBatchDisplayCustomer> productBatchDisplayCustomerHashMap = new HashMap<>();
            for (ProductBatch productBatch : product.getProductBatchList()) {
                // check if same expired date then add id to nearest expired date batch
                if (productBatch.getExpiredDate().equals(productDisplayCustomerTemp.getNearestExpiredBatch().getExpiredDate())) {
                    productDisplayCustomerTemp.getNearestExpiredBatch().getIdList().add(productBatch.getId());
                    productDisplayCustomerTemp.getNearestExpiredBatch().setQuantity(productDisplayCustomerTemp.getNearestExpiredBatch().getQuantity() + productBatch.getQuantity());
                } else {
                    // map and handle same expired date batch
                    if (productBatchDisplayCustomerHashMap.containsKey(productBatch.getExpiredDate())) {
                        ProductBatchDisplayCustomer productBatchDisplayCustomerTemp = productBatchDisplayCustomerHashMap.get(productBatch.getExpiredDate());
                        productBatchDisplayCustomerTemp.getIdList().add(productBatch.getId());
                        productBatchDisplayCustomerTemp.setQuantity(productBatchDisplayCustomerTemp.getQuantity() + productBatch.getQuantity());
                    } else {
                        productBatchDisplayCustomerHashMap.put(productBatch.getExpiredDate(), new ProductBatchDisplayCustomer(productBatch));
                    }
                }
            }
            // map product batch hash map to list
            List<ProductBatchDisplayCustomer> productBatchDisplayCustomerList = productBatchDisplayCustomerHashMap.values().stream().collect(Collectors.toList());
            // sort list batch by expired date ASC
            productBatchDisplayCustomerList.sort((o1, o2) -> o1.getExpiredDate().compareTo(o2.getExpiredDate()));
            productDisplayCustomerTemp.getOtherProductBatchList().addAll(productBatchDisplayCustomerList);
        }

        // set price range
        for (ProductDisplayCustomer productDisplayCustomer : productDisplayCustomerList) {
            // get from range
            Integer minPrice = productDisplayCustomer.getNearestExpiredBatch().getPrice();
            // get to range
            Integer maxPrice = null;
            if (productDisplayCustomer.getOtherProductBatchList().size() > 0) {
                maxPrice = productDisplayCustomer.getOtherProductBatchList().stream().mapToInt(value -> value.getPrice()).max().orElse(0);
            }
            // set range
            if (maxPrice != null) {
                if (minPrice > maxPrice) {
                    Integer temp = minPrice;
                    minPrice = maxPrice;
                    maxPrice = temp;
                }
                productDisplayCustomer.setFromPriceRange(minPrice);
                productDisplayCustomer.setToPriceRange(maxPrice);
            } else {
                productDisplayCustomer.setFromPriceRange(minPrice);
            }
        }


        return new ProductListCustomerResponseBody(productDisplayCustomerList, totalPage, totalProduct);
    }


    @Override
    public List<SaleReportSupermarketMonthlyResponseBody> getSaleReportSupermarket(UUID supermarketId, Integer year) {
        LocalDate currentDate = LocalDate.now();
        if (!supermarketRepository.findById(supermarketId).isPresent()) {
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.SUPERMARKET_NOT_FOUND.getCode()), AdditionalResponseCode.SUPERMARKET_NOT_FOUND.toString());
        }
        if (year == null) {
            year = currentDate.getYear();
        }

        List<Object[]> resultList = productRepository.getProductsReportForSupermarket(supermarketId, year);

        // map result
        List<SaleReportSupermarketMonthlyResponseBody> saleReportSupermarketMonthlyList = resultList.stream().map(result -> (SaleReportSupermarketMonthlyResponseBody) result[1]).collect(Collectors.toList());
        HashMap<Integer, SaleReportSupermarketMonthlyResponseBody> saleReportSupermarketMonthHashMap = new HashMap<>();

        saleReportSupermarketMonthlyList.stream().forEach(saleReportSupermarketMonthlyResponseBody -> {
            saleReportSupermarketMonthHashMap.put(saleReportSupermarketMonthlyResponseBody.getMonthValue(), saleReportSupermarketMonthlyResponseBody);
        });

        for (int i = 1; i <= 12; i++) {
            if (!saleReportSupermarketMonthHashMap.containsKey(i)) {
                SaleReportSupermarketMonthlyResponseBody saleReportSupermarketMonthlyResponseBody = new SaleReportSupermarketMonthlyResponseBody(i, Long.parseLong("0"), Long.parseLong("0"));
                saleReportSupermarketMonthlyList.add(saleReportSupermarketMonthlyResponseBody);
            }
        }

        saleReportSupermarketMonthlyList.sort((o1, o2) -> o1.getMonthValue() - o2.getMonthValue());

//        productEntityReportList.stream().forEach(product -> {
//            saleReportResponseBody.getProductSaleReportList().add(new ProductSaleReport(product));
//            saleReportResponseBody.setTotalSale(saleReportResponseBody.getTotalSale() + product.getQuantity());
//            saleReportResponseBody.setTotalIncome(saleReportResponseBody.getTotalIncome() + product.getPrice());
//        });
        return saleReportSupermarketMonthlyList;
    }


    @Override
    @Transactional
    public Product getById(UUID id) {
        Optional<Product> product = productRepository.findByIdCustom(id);
        if (!product.isPresent()) {
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.PRODUCT_NOT_FOUND.getCode()), AdditionalResponseCode.PRODUCT_NOT_FOUND.toString());
        }
        return product.get();
    }

    @Override
    public List<ProductCateWithSubCate> getAllCategory(UUID pickupPointId) {
        List<ProductCateWithSubCate> productCategoryList = productCategoryRepository.getAllProductCategoryWithSubCate(pickupPointId);
        return productCategoryList;
    }

    @Override
    public List<ProductSubCateOnly> getAllSubCategory(UUID pickupPointId) {
        List<ProductSubCateOnly> productSubCateOnlyList = productSubCategoryRepository.findAllSubCategoryOnly(pickupPointId);
        return productSubCateOnlyList;
    }

    @Override
    public ProductCategory createCategory(ProductCategoryCreateBody productCategoryCreateBody) {
        return productCategoryService.createCategory(productCategoryCreateBody);
    }

    @Override
    public ProductSubCategory createSubCategory(ProductSubCategoryCreateBody productSubCategoryCreateBody) {
        return productSubCategoryService.createSubCategory(productSubCategoryCreateBody);
    }

    @Override
    public ProductCategory updateProductCategory(ProductCategoryUpdateBody productCategoryUpdateBody, UUID categoryId) {
        return productCategoryService.updateCategory(productCategoryUpdateBody, categoryId);
    }

    @Override
    public ProductSubCategory updateProductSubCategory(ProductSubCategoryUpdateBody productSubCategoryUpdateBody, UUID subCategoryId) {
        return productSubCategoryService.updateSubCategory(productSubCategoryUpdateBody, subCategoryId);
    }

    @Override
    public ProductExcelResponse createProductList(List<ProductCreateList> productList) throws ResourceNotFoundException {
        LinkedHashMap<Integer, List<String>> errorFields = new LinkedHashMap<>();
        List<Product> productsSaved = new ArrayList<>();
        Integer productCount = 1;
        for (ProductCreateList productCreate : productList) {
            List<String> errors = new ArrayList<>();
            if (productCreate.getName().length() > 255) {
                errors.add("Tên sản phẩm: " + productCreate.getName() + " quá 255 kí tự!");
            }

            if (productCreate.getUnit().length() > 50) {
                errors.add("Đơn vị sản phẩm: " + productCreate.getUnit() + " quá 50 kí tự!");
            }

            if (productCreate.getImageUrls().size() == 0) {
                errors.add("Vui lòng thêm hình cho sản phẩm!");
            }

            if (productCreate.getPriceListed() < 0) {
                errors.add("Giá niêm yết không thể âm!");
            }

            UUID productSubCategoryId = productCreate.getProductSubCategory().getId();
            if (productSubCategoryId == null) {
                errors.add("Vui lòng nhập thông tin Loại danh mục phụ!");
            } else if (!productSubCategoryRepository.findById(productSubCategoryId).isPresent()) {
                errors.add("Danh mục phụ không tìm thấy với id: " + productSubCategoryId);
            }

            UUID supermarketId = productCreate.getSupermarket().getId();
            Optional<Supermarket> supermarket = supermarketRepository.findById(supermarketId);
            if (supermarketId == null) {
                errors.add("Vui lòng nhập thông tin siêu thị!");
            } else if (!supermarket.isPresent()) {
                errors.add("Siêu thị không tìm thấy với id: " + supermarketId);
            }

            List<ProductBatchCreateList> productBatchesCreate = productCreate.getProductBatchList();
            productBatchesCreate.forEach(productBatchCreate -> {
                if (productBatchCreate.getPrice() == null) {
                    errors.add("Vui lòng nhập giá bán của lô sản phẩm " + productBatchCreate.getExpiredDate());
                } else if (productBatchCreate.getPrice() != null && productBatchCreate.getPrice() < 0) {
                    errors.add("Giá bán của lô sản phẩm " + productBatchCreate.getExpiredDate() + "đang âm!");
                }

                if (productBatchCreate.getExpiredDate() == null) {
                    errors.add("Vui lòng nhập ngày hết hạn của lô sản phẩm");
                } else if (productBatchCreate.getExpiredDate() != null && productSubCategoryRepository.findById(productSubCategoryId).isPresent() && productBatchCreate.getExpiredDate().isBefore(LocalDate.now().plus(productCreate.getProductSubCategory().getAllowableDisplayThreshold(), ChronoUnit.DAYS))) {
                    errors.add("Ngày hết hạn của lô sản phẩm " + productBatchCreate.getExpiredDate() + " phải sau ngày hiện tại cộng thêm số ngày điều kiện cho hàng cận hạn sử dụng có trong SUBCATEGORY!");
                }
                if (productBatchCreate.getPriceOriginal() == null) {
                    errors.add("Vui lòng nhập giá gốc của lô sản phẩm " + productBatchCreate.getExpiredDate());
                } else if (productBatchCreate.getPriceOriginal() != null && productBatchCreate.getPriceOriginal() < 0) {
                    errors.add("Giá gốc của lô sản phẩm " + productBatchCreate.getExpiredDate() + "đang âm!");
                }

                productBatchCreate.getProductBatchAddresses().forEach(productBatchAddressCreateList -> {
                    if (supermarket.isPresent()) {
                        if (supermarket.get().getSupermarketAddressList().stream()
                                .noneMatch(supermarketAddress -> productBatchAddressCreateList.getSupermarketAddress().getAddress().equals(supermarketAddress.getAddress()))) {
                            errors.add("Địa chỉ " + productBatchAddressCreateList.getSupermarketAddress().getAddress() + " không tìm thấy trong danh sách địa chỉ chi nhánh của siêu thị!");
                        }
                        if (productBatchAddressCreateList.getQuantity() == null) {
                            errors.add("Vui lòng nhập số lượng của lô sản phẩm " + productBatchCreate.getExpiredDate());
                        } else if (productBatchAddressCreateList.getQuantity() != null && productBatchAddressCreateList.getQuantity() <= 0) {
                            errors.add("Số lượng của lô sản phẩm " + productBatchCreate.getExpiredDate() + "đang âm hoặc bằng 0!");
                        }
                    }
                });

            });

            if (errors.size() > 0) {
                errorFields.put(productCount, errors);
            }
            productCount++;
        }

        if (errorFields.size() > 0) {
            return new ProductExcelResponse(productList, errorFields);
        }

        productList.stream().forEach(product -> {
            Product productEntity = new Product();
            ModelMapper mapper = new ModelMapper();
            mapper.map(product, productEntity);

            List<ProductBatchCreateList> productBatchesCreate = product.getProductBatchList();
            List<ProductBatch> productBatches = new ArrayList<>();
            productBatchesCreate.forEach(batch -> {
                batch.getProductBatchAddresses().forEach(address -> {
                    ProductBatch productBatch = new ProductBatch();
                    productBatch.setPrice(batch.getPrice());
                    productBatch.setPriceOriginal(batch.getPriceOriginal());
                    productBatch.setExpiredDate(batch.getExpiredDate());
                    productBatch.setQuantity(address.getQuantity());
                    productBatch.setSupermarketAddress(address.getSupermarketAddress());
                    productBatch.setProduct(productEntity);
                    productBatches.add(productBatch);
                });
            });
            productEntity.setProductBatchList(productBatches);

            List<String> productImageCreate = product.getImageUrls();
            List<ProductImage> productImages = new ArrayList<>();
            productImageCreate.forEach(image -> {
                ProductImage productImage = new ProductImage();
                productImage.setImageUrl(image);
                productImage.setProduct(productEntity);
                productImages.add(productImage);
            });
            productEntity.setProductImageList(productImages);

            String unit = productEntity.getUnit().toLowerCase();
            productEntity.setUnit(unit);
            productEntity.setStatus(Status.ENABLE.ordinal());
            Product productSaved = productRepository.save(productEntity);
            product.setId(productSaved.getId());

            productsSaved.add(productSaved);

        });
        return new ProductExcelResponse(productList, errorFields);

    }

    public List<RevenueReportMonthly> getRevenueReportForEachMonth(Integer year) {
        LocalDate currentDate = LocalDate.now();

        if (year == null) {
            year = currentDate.getYear();
        }

        List<Object[]> revenueResult = productRepository.getRevenueReportMonthly(year);
        // map result
        List<RevenueReportMonthly> revenueReportMonthlyList = revenueResult.stream().map(result -> (RevenueReportMonthly) result[1]).collect(Collectors.toList());
        HashMap<Integer, RevenueReportMonthly> reportMonthlyHashMap = new HashMap<>();
        revenueReportMonthlyList.stream().forEach(revenueReportMonthly -> {
            reportMonthlyHashMap.put(revenueReportMonthly.getMonthValue(), revenueReportMonthly);
        });

        // 12 months
        for (int i = 1; i <= 12; i++) {
            if (!reportMonthlyHashMap.containsKey(i)) {
                RevenueReportResponseBody revenueReportResponseBody = new RevenueReportResponseBody(null, null, null);
                revenueReportMonthlyList.add(new RevenueReportMonthly(i, revenueReportResponseBody));
            }
        }

        revenueReportMonthlyList.sort((o1, o2) -> o1.getMonthValue() - o2.getMonthValue());
//        revenueReportResponseBody.setTotalIncome((RevenueReportResponseBody) revenueResult[0]);
//        revenueReportResponseBody.setTotalInvestment((Long) revenueResult[1]);
//        revenueReportResponseBody.setTotalSale((Long) revenueResult[2]);

//        revenueReportResponseBody.setTotalDifferentAmount(revenueReportResponseBody.getTotalIncome()- revenueReportResponseBody.getTotalPriceOriginal());

        return revenueReportMonthlyList;
    }

    @Override
    public List<RevenueReportYearly> getRevenueReportForEachYear() {
        Integer appBuildYear = 2023;
        Integer currentYear = LocalDate.now().getYear();

        List<Object[]> revenueResult = productRepository.getRevenueReportYearly(appBuildYear, currentYear);
        // map result
        List<RevenueReportYearly> revenueReportYearlyList = revenueResult.stream().map(result -> (RevenueReportYearly) result[1]).collect(Collectors.toList());
        HashMap<Integer, RevenueReportYearly> reportYearlyHashMap = new HashMap<>();
        revenueReportYearlyList.stream().forEach(revenueReportYearly -> {
            reportYearlyHashMap.put(revenueReportYearly.getYearValue(), revenueReportYearly);
        });

        // 12 months
        for (int i = appBuildYear; i <= currentYear; i++) {
            if (!reportYearlyHashMap.containsKey(i)) {
                RevenueReportResponseBody revenueReportResponseBody = new RevenueReportResponseBody(null, null, null);
                revenueReportYearlyList.add(new RevenueReportYearly(i, revenueReportResponseBody));
            }
        }

        revenueReportYearlyList.sort((o1, o2) -> o1.getYearValue() - o2.getYearValue());

        return revenueReportYearlyList;
    }

    @Override
    public List<SupermarketSaleReportResponseBody> getAllSupermarketSaleReport(Integer year) {
        LocalDate currentDate = LocalDate.now();
        if (year == null) {
            year = currentDate.getYear();
        }
        List<Supermarket> rawSupermarketList = supermarketRepository.findAll();
        List<SupermarketSaleReportResponseBody> allSupermarketSaleReportResponseBodyList = new ArrayList<>();
        allSupermarketSaleReportResponseBodyList.addAll(rawSupermarketList.stream().map(SupermarketSaleReportResponseBody::new).collect(Collectors.toList()));

        List<SupermarketSaleReportResponseBody> result = productRepository.getSupermarketsSaleReport(year);
        HashMap<UUID, SupermarketSaleReportResponseBody> resultHashmap = new HashMap<>();
        result.stream().forEach(supermarketSaleReportResponseBody -> {
            resultHashmap.put(supermarketSaleReportResponseBody.getId(), supermarketSaleReportResponseBody);
        });
        for (SupermarketSaleReportResponseBody saleReportResponseBody : allSupermarketSaleReportResponseBodyList) {
            if (resultHashmap.containsKey(saleReportResponseBody.getId())) {
                saleReportResponseBody.setTotalSale(resultHashmap.get(saleReportResponseBody.getId()).getTotalSale());
                saleReportResponseBody.setTotalIncome(resultHashmap.get(saleReportResponseBody.getId()).getTotalIncome());
            }
        }

        return allSupermarketSaleReportResponseBodyList;
    }


    @Override
    public List<ProductSaleReport> getRevenueReportForEachProductForSupermarket(Month month, Integer year, UUID supermarketId) {

        List<ProductSaleReport> productSaleReportList = productRepository.findAllWithSubFieldWithSupermarket(supermarketId).stream().map(product -> new ProductSaleReport(product.getId(), product.getName(), product.getSupermarket().getName())).collect(Collectors.toList());

        List<Object[]> result = productRepository.getRevenueReportForEachProductForSupermarket(month == null ? null : month.getMonthInNumber(), year, supermarketId);
        HashMap<UUID, Object[]> resultHashMap = new HashMap<>();
        for (Object[] objects : result) {
            resultHashMap.put((UUID) objects[0], objects);
        }

        for (ProductSaleReport productSaleReport : productSaleReportList) {
            if (resultHashMap.containsKey(productSaleReport.getId())) {
                Object[] productReportResult = resultHashMap.get(productSaleReport.getId());
//                UUID productId = (UUID) productReportResult[0];
//                String productName = (String) productReportResult[1];
//                String supermarketName = (String) productReportResult[2];
                Long totalIncome = (Long) productReportResult[3];
                Long boughtQuantity = (Long) productReportResult[4];
                productSaleReport.setTotalIncome(totalIncome);
                productSaleReport.setSoldQuantity(boughtQuantity.intValue());
            }
        }

        productSaleReportList.sort((o1, o2) -> o2.getSoldQuantity().compareTo(o1.getSoldQuantity()));

        return productSaleReportList;
    }


    @Override
    public List<CateOderQuantityResponseBody> getOrderTotalAllCategorySupermarket(UUID supermarketId, Integer year) {
        LocalDate currentDate = LocalDate.now();

        if (!supermarketRepository.findById(supermarketId).isPresent()) {
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.SUPERMARKET_NOT_FOUND.getCode()), AdditionalResponseCode.SUPERMARKET_NOT_FOUND.toString());
        }

        if (year == null) {
            year = currentDate.getYear();
        }

        List<ProductCategory> rawProductCategoryList = productCategoryRepository.findAll();
        List<CateOderQuantityResponseBody> cateOderQuantityResponseList = rawProductCategoryList.stream().map(productCategory -> new CateOderQuantityResponseBody(productCategory.getId(), productCategory.getName(), Long.parseLong("0"))).collect(Collectors.toList());


        List<CateOderQuantityResponseBody> result = productRepository.getOrderTotalAllCategoryReport(supermarketId, year);
        HashMap<UUID, CateOderQuantityResponseBody> cateOderQuantityResponseHashmap = new HashMap<>();
        result.stream().forEach(cateOderQuantityResponseBody -> {
            cateOderQuantityResponseHashmap.put(cateOderQuantityResponseBody.getCategoryId(), cateOderQuantityResponseBody);
        });

        for (CateOderQuantityResponseBody cateOderQuantityResponseBody : cateOderQuantityResponseList) {
            if (cateOderQuantityResponseHashmap.containsKey(cateOderQuantityResponseBody.getCategoryId())) {
                cateOderQuantityResponseBody.setTotalOrderQuantity(cateOderQuantityResponseHashmap.get(cateOderQuantityResponseBody.getCategoryId()).getTotalOrderQuantity());
            }
        }

        cateOderQuantityResponseList.sort((o1, o2) -> o2.getTotalOrderQuantity() - o1.getTotalOrderQuantity());

        return cateOderQuantityResponseList;
    }

    @Override
    public CategoryListResponseBody getCategoryForStaff(String name, EnableDisableStatus status, Integer page, Integer limit) {
        Pageable pageable = PageRequest.of(limit == null ? 0 : page, limit == null ? Integer.MAX_VALUE : limit);
        Page<ProductCateWithSubCate> result = productCategoryRepository.getAllProductCategoryWithSubCateForStaff(name, pageable);
        int totalPage = result.getTotalPages();
        long totalCategory = result.getTotalElements();
        List<ProductCateWithSubCate> productCateWithSubCateList = result.stream().toList();

        return new CategoryListResponseBody(productCateWithSubCateList, totalPage, totalCategory);
    }

    @Override
    public SubCategoryListResponseBody getSubCategoryForStaff(String name, EnableDisableStatus status, UUID productCategoryId, Integer page, Integer limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<ProductSubCateOnly> result = productSubCategoryRepository.findAllSubCategoryOnlyForStaff(name, productCategoryId == null ? null : productCategoryId, pageable);
        int totalPage = result.getTotalPages();
        long totalSubCategory = result.getTotalElements();
        List<ProductSubCateOnly> productSubCateOnlyList = result.stream().toList();

        return new SubCategoryListResponseBody(productSubCateOnlyList, totalPage, totalSubCategory);
    }

    @Override
    public List<ProductSaleReport> getRevenueReportForEachProduct(Month month, Integer year) {

        List<ProductSaleReport> productSaleReportList = productRepository.findAllWithSubField().stream().map(product -> new ProductSaleReport(product.getId(), product.getName(), product.getSupermarket().getName())).collect(Collectors.toList());

        List<Object[]> result = productRepository.getRevenueReportForEachProduct(month == null ? null : month.getMonthInNumber(), year);
        HashMap<UUID, Object[]> resultHashMap = new HashMap<>();
        for (Object[] objects : result) {
            resultHashMap.put((UUID) objects[0], objects);
        }

        for (ProductSaleReport productSaleReport : productSaleReportList) {
            if (resultHashMap.containsKey(productSaleReport.getId())) {
                Object[] productReportResult = resultHashMap.get(productSaleReport.getId());
//                UUID productId = (UUID) productReportResult[0];
//                String productName = (String) productReportResult[1];
//                String supermarketName = (String) productReportResult[2];
                Long totalIncome = (Long) productReportResult[3];
                Long boughtQuantity = (Long) productReportResult[4];
                productSaleReport.setTotalIncome(totalIncome);
                productSaleReport.setSoldQuantity(boughtQuantity.intValue());
            }
        }

        productSaleReportList.sort((o1, o2) -> o2.getSoldQuantity().compareTo(o1.getSoldQuantity()));

        return productSaleReportList;
    }

    @Override
    @Transactional
    public Product updateProduct(ProductDisplayStaff productDisplayStaff) throws ResourceNotFoundException {
        HashMap<String, String> errorFields = new HashMap<>();
        Optional<Product> product = productRepository.findById(productDisplayStaff.getId());

        if (product.isEmpty()) {
            throw new ResourceNotFoundException("Sản phảm không tìm thấy với id: " + productDisplayStaff.getId());
        }

        UUID productSubCategoryId = productDisplayStaff.getProductSubCategory().getId();
        if (productSubCategoryRepository.findById(productSubCategoryId).isEmpty()) {
            throw new ResourceNotFoundException("Loại sản phảm phụ không tìm thấy với id: " + productSubCategoryId);
        }

        UUID supermarketId = productDisplayStaff.getSupermarket().getId();
        if (supermarketRepository.findById(supermarketId).isEmpty()) {
            throw new ResourceNotFoundException("Siêu thị không tìm thấy với id: " + productSubCategoryId);
        }

        if (productDisplayStaff.getName().length() > 255) {
            errorFields.put("Lỗi nhập tên sản phẩm", "Tên sản phẩm chỉ có tối đa 255 kí tự!");
        }

        if (productDisplayStaff.getUnit().length() > 50) {
            errorFields.put("Lỗi nhập đơn vị sản phẩm", "Đơn vị sản phẩm chỉ có tối đa 50 kí tự!");
        }

        if (productDisplayStaff.getImageUrlImageList().size() == 0) {
            errorFields.put("Lỗi hình ảnh sản phẩm", "Vui lòng thêm hình cho sản phẩm!");
        }

        HashSet<UUID> productBatchIdList = new HashSet<>();
        productDisplayStaff.getProductBatchDisplayStaffList().forEach(productBatchDisplayStaff -> {
            if (productBatchDisplayStaff.getPrice() < 0 || productBatchDisplayStaff.getPriceOriginal() < 0) {
                errorFields.put("Lỗi nhập giá", "Giá không thế âm!");
            }
            if (productBatchDisplayStaff.getExpiredDate().isBefore(LocalDate.now().plus(productDisplayStaff.getProductSubCategory().getAllowableDisplayThreshold(), ChronoUnit.DAYS))) {
                errorFields.put("Lỗi nhập ngày hết hạn", "Ngày hết hạn phải sau ngày hiện tại cộng thêm số ngày điều kiện cho hàng cận hạn sử dụng có trong SUBCATEGORY!");
            }
            ;
            productBatchDisplayStaff.getProductBatchAddressDisplayStaffList().forEach(productBatchAddressDisplayStaff -> {
                if (productBatchAddressDisplayStaff.getQuantity() <= 0) {
                    errorFields.put("Lỗi nhập số lượng", "Số lượng sản phẩm không thể âm hoặc bằng 0!");
                }
                if (productDisplayStaff.getSupermarket().getSupermarketAddressList().stream().filter(supermarketAddress -> productBatchAddressDisplayStaff.getSupermarketAddress().getId().equals(supermarketAddress.getId())).toList().size() == 0) {
                    errorFields.put("Lỗi địa chỉ siêu thị cho lô HSD: " + productBatchDisplayStaff.getExpiredDate(), "Địa chỉ siêu thị không tìm thấy với id hoặc không có trong danh sách địa chỉ của siêu thị: " + productDisplayStaff.getSupermarket().getName());
                }
                productBatchIdList.add(productBatchAddressDisplayStaff.getProductBatchId());
            });

        });

        // delete batch
        List<ProductBatch> productBatchList = product.get().getProductBatchList();
        List<UUID> productBatchDeleteIdList = new ArrayList<>();
        for (ProductBatch productBatch : productBatchList) {
            if (!productBatchIdList.contains(productBatch.getId())) {
                if (orderRepository.findOrderByProductBatchId(productBatch.getId(), PageRequest.of(0, 1)).size() > 0) {
                    errorFields.put("Lỗi địa chỉ hoặc lô hàng", "Lô hàng ở địa chỉ " + productBatch.getSupermarketAddress().getAddress() + " đã tồn tại trong một hoặc nhiều đơn hàng nên không thể xóa");
                }
                productBatchDeleteIdList.add(productBatch.getId());
            }
        }
        if (!errorFields.containsKey("Lỗi địa chỉ hoặc lô hàng") && productBatchDeleteIdList.size() > 0) {
            productBatchRepository.deleteAllById(productBatchDeleteIdList);
        }


//        product.getProductBatchList().forEach(productBatch -> {
//            if (productBatch.getPrice() < 0 || productBatch.getPriceOriginal() < 0) {
//                errorFields.put("Lỗi nhập giá", "Giá không thế âm!");
//            }
//
//            if (productBatch.getQuantity() <= 0) {
//                errorFields.put("Lỗi nhập số lượng", "Số lượng sản phẩm không thể âm hoặc bằng 0!");
//            }
//
//            if (productBatch.getExpiredDate().isBefore(LocalDate.now().plus(product.getProductSubCategory().getAllowableDisplayThreshold(), ChronoUnit.DAYS))) {
//                errorFields.put("Lỗi nhập ngày hết hạn", "Ngày hết hạn phải sau ngày hiện tại cộng thêm số ngày điều kiện cho hàng cận hạn sử dụng có trong SUBCATEGORY!");
//            }
//            if (!productBatch.getSupermarketAddress().getSupermarket().getId().equals(product.getSupermarket().getId())) {
//                errorFields.put("Lỗi địa chỉ siêu thị cho lô HSD: " + productBatch.getExpiredDate(), "Địa chỉ siêu thị không tìm thấy với id hoặc không có trong danh sách địa chỉ của siêu thị: " + product.getSupermarket().getName());
//            }
//        });

        if (errorFields.size() > 0) {
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

//        String unit = product.getUnit().toLowerCase();
//        product.setUnit(unit);

        Product productResult = new Product(productDisplayStaff);


        return productRepository.save(productResult);
    }

    @Override
    public Product disableProduct(UUID productId) throws ResourceNotFoundException {
        Optional<Product> product = productRepository.findById(productId);
        if (product.isEmpty()) {
            throw new ResourceNotFoundException("Sản phảm không tìm thấy với id: " + productId);
        }
        product.get().setStatus(Status.DISABLE.ordinal());

        return productRepository.save(product.get());
    }

    @Override
    @Transactional
    public Product enableProduct(UUID productId) throws ResourceNotFoundException {
        Optional<Product> product = productRepository.findById(productId);
        if (product.isEmpty()) {
            throw new ResourceNotFoundException("Sản phảm không tìm thấy với id: " + productId);
        }
        product.get().setStatus(Status.ENABLE.ordinal());
        return product.get();
    }

    @Override
    public List<ProductSubCateOnly> getAllSubCategoryForStaff() {
        List<ProductSubCateOnly> productSubCateOnlyList = productRepository.getAllSubCategoryForStaff();
        return productSubCateOnlyList;
    }

    @Override
    @Transactional
    public Product createProduct(ProductCreate productCreate) throws ResourceNotFoundException {
        HashMap<String, String> errorFields = new HashMap<>();
        Product product = new Product();
        if (productCreate.getName().length() > 255) {
            errorFields.put("Lỗi nhập tên sản phẩm", "Tên sản phẩm chỉ có tối đa 255 kí tự!");
        }

        if (productCreate.getUnit().length() > 50) {
            errorFields.put("Lỗi nhập đơn vị sản phẩm", "Đơn vị sản phẩm chỉ có tối đa 50 kí tự!");
        }

        if (productCreate.getPriceListed() < 0) {
            errorFields.put("Lỗi nhập giá niêm yết sản phẩm", "Giá niêm yết không thể âm!");
        }

        if (productCreate.getProductSubCategory().getId() == null && productCreate.getProductSubCategory().getName().length() > 50) {
            errorFields.put("Lỗi nhập tên SubCategory", "Tên sản phẩm chỉ có tối đa 50 kí tự!");
        }

        if (productCreate.getProductSubCategory().getId() == null && productCreate.getProductSubCategory().getAllowableDisplayThreshold() <= 0) {
            errorFields.put("Lỗi nhập AllowableDisplayThreshold", "AllowableDisplayThreshold không thể âm hoặc bằng 0!");
        }

        if (productCreate.getProductSubCategory().getProductCategory().getId() == null && productCreate.getProductSubCategory().getProductCategory().getName().length() > 50) {
            errorFields.put("Lỗi nhập tên category", "Tên category chỉ có tối đa 50 kí tự!");
        }

        if (productCreate.getImageUrls().isEmpty()) {
            errorFields.put("Lỗi hình ảnh", "Vui lòng thêm ảnh cho sản phẩm!");
        }

        Optional<Supermarket> supermarket = supermarketRepository.findById(productCreate.getSupermarketId());
        if (supermarket.isEmpty()) {
            errorFields.put("Lỗi không tìm thấy", "Siêu thị không tìm thấy với id: " + productCreate.getSupermarketId());
        }

        for (ProductBatchRequest productBatch : productCreate.getProductBatchList()) {
            if (productBatch.getPrice() < 0 || productBatch.getPriceOriginal() < 0) {
                errorFields.put("Lỗi nhập giá cho lô HSD " + productBatch.getExpiredDate(), "Giá bán không thể âm!");
            }

            Integer althd = productCreate.getProductSubCategory().getId() != null ?
                    productSubCategoryRepository.findById(productCreate.getProductSubCategory().getId())
                            .orElseThrow(() -> new ResourceNotFoundException("Product Sub Category không tìm thấy với id: " + productCreate.getProductSubCategory().getId())).getAllowableDisplayThreshold() : productCreate.getProductSubCategory().getAllowableDisplayThreshold();

            if (productBatch.getExpiredDate().isBefore(LocalDate.now().plus(althd, ChronoUnit.DAYS))) {
                errorFields.put("Lỗi nhập ngày hết hạn cho lô HSD " + productBatch.getExpiredDate(), "Ngày hết hạn phải sau ngày hiện tại cộng thêm số ngày điều kiện cho hàng cận hạn sử dụng có trong SUBCATEGORY!");
            }
        }


        if (errorFields.size() > 0) {
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }


        List<ProductBatch> productBatchList = new ArrayList<>();
        for (ProductBatchRequest productBatchRequest : productCreate.getProductBatchList()) {
            for (ProductBatchAddress productBatchAddress : productBatchRequest.getProductBatchAddresses()) {
                Optional<SupermarketAddress> supermarketAddress = supermarketAddressRepository.findById(productBatchAddress.getSupermarketAddressId());
                if (supermarketAddress.isPresent() && supermarket.isPresent() && supermarketAddress.get().getSupermarket().getId().equals(supermarket.get().getId())) {
                    ProductBatch productBatch = new ProductBatch();
                    productBatch.setPrice(productBatchRequest.getPrice());
                    productBatch.setPriceOriginal(productBatchRequest.getPriceOriginal());
                    productBatch.setExpiredDate(productBatchRequest.getExpiredDate());
                    productBatch.setQuantity(productBatchAddress.getQuantity());
                    productBatch.setSupermarketAddress(supermarketAddress.get());
                    productBatchList.add(productBatch);
                } else {
                    throw new ResourceNotFoundException("Địa chỉ siêu thị cho lô HSD: " + productBatchRequest.getExpiredDate() + " không tìm thấy với id hoặc không có trong danh sách địa chỉ của siêu thị: " + supermarket.get().getName());
                }
            }
        }

        ModelMapper modelMapper = new ModelMapper();
        modelMapper.map(productCreate, product);
        List<ProductImage> productImageList = new ArrayList<>();
        productCreate.getImageUrls().forEach(imageUrl -> {
            ProductImage image = new ProductImage();
            image.setImageUrl(imageUrl);
            image.setProduct(product);
            productImageList.add(image);
        });
        product.setProductImageList(productImageList);
        product.setSupermarket(supermarket.get());
        productBatchList.forEach(productBatch -> {
            productBatch.setProduct(product);
        });
        product.setProductBatchList(productBatchList);
        String unit = product.getUnit().toLowerCase();
        product.setUnit(unit);
        product.setStatus(Status.ENABLE.ordinal());

        UUID productCategoryId = product.getProductSubCategory().getProductCategory().getId();
        UUID productSubCategoryId = product.getProductSubCategory().getId();

        //Save new product Category if id is null
        if (productSubCategoryId == null) {
            if (productCategoryId != null) {
                product.getProductSubCategory()
                        .setProductCategory(productCategoryRepository.findById(productCategoryId)
                                .orElseThrow(() -> new ResourceNotFoundException("Product Category không tìm thấy với id: " + productCategoryId)));
            } else {
                ProductCategory productCategoryNew = productCategoryRepository.save(product.getProductSubCategory().getProductCategory());
                product.getProductSubCategory().setProductCategory(productCategoryNew);
            }
        }

        //Save new product sub Category if id is null
        product.setProductSubCategory(productSubCategoryId != null ?
                productSubCategoryRepository.findById(productSubCategoryId)
                        .orElseThrow(() -> new ResourceNotFoundException("Product Sub Category không tìm thấy với id: " + productSubCategoryId))
                :
                productSubCategoryRepository.save(product.getProductSubCategory()));


        return productRepository.save(product);
    }

    @Override
    public ProductExcelResponse createProductByExcel(MultipartFile file) throws IOException, InvalidExcelFileDataException {

        LinkedHashMap<Integer, List<String>> errorFields = new LinkedHashMap<>();
        LinkedHashMap<Integer, List<ByteArrayOutputStream>> productImages = new LinkedHashMap<>();
        Workbook workbook;
        if (isXLSFile(file)) {
            workbook = new HSSFWorkbook(file.getInputStream());
        } else if (isXLSXFile(file)) {
            workbook = new XSSFWorkbook(file.getInputStream());
        } else {
            LinkedHashMap<String, String> errorFieldsFile = new LinkedHashMap<>();
            errorFieldsFile.put("Invalid file type", "File này có định dạng không phải excel!");
            throw new InvalidExcelFileDataException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFieldsFile);
        }

        List<ProductCreateList> productList = new ArrayList<>();
        Set<ProductExcelCreate> productSeenData = new HashSet<>();

        Sheet sheet = workbook.getSheetAt(0);

        try {
            XSSFDrawing drawing = (XSSFDrawing) sheet.createDrawingPatriarch();
            for (XSSFShape shape : drawing.getShapes()) {
                if (shape instanceof XSSFPicture) {
                    XSSFPicture pic = (XSSFPicture) shape;
                    XSSFClientAnchor anchor = pic.getClientAnchor();

                    // Extracting row and column information from the anchor
                    int rowImage = anchor.getRow1();
                    int colImage = anchor.getCol1();

                    byte[] data = pic.getPictureData().getData();
                    ByteArrayOutputStream productImageByteArrayOutputStream = new ByteArrayOutputStream();
                    productImageByteArrayOutputStream.write(data, 0, data.length);
                    if(productImages.get(rowImage) != null && productImages.get(rowImage).size() > 0){
                        productImages.get(rowImage).add(productImageByteArrayOutputStream);
                    }else{
                        List<ByteArrayOutputStream> imageList = new ArrayList<>();
                        imageList.add(productImageByteArrayOutputStream);
                        productImages.put(rowImage,imageList);
                    }
                }
            }

            //Get first row as title
            Row titleRow = sheet.getRow(0);

            int rowIndex = 0;
            for (Row row : sheet) {
                if (rowIndex != 0) {
                    ProductCreateList product = new ProductCreateList();
                    ProductSubCategory productSubCategory = new ProductSubCategory();
                    Supermarket supermarket = new Supermarket();
                    List<ProductExcelBatchCreate> productBatchCreateList = new ArrayList<>();
                    ProductExcelBatchCreate productBatchCreate = new ProductExcelBatchCreate();
                    List<String> errors = new ArrayList<>();
                    int cellIndex = 0;
                    for (Cell cell : row) {
                        if (cell.getCellType() != CellType.BLANK && row.getCell(cellIndex) != null) {
                            log.info(titleRow.getCell(cellIndex) + ", " + row.getCell(cellIndex));
                            validateAndGetProductSubCateData(productSubCategory, titleRow, row.getCell(cellIndex), errors, cellIndex);
                            validateAndGetSupermarketData(supermarket, titleRow, row.getCell(cellIndex), errors, cellIndex);
                            validateAndGetProductData(product, titleRow, row.getCell(cellIndex), errors, cellIndex);
                            validateAndGetProductBatchData(productBatchCreate, productBatchCreateList, titleRow, row.getCell(cellIndex), errors, cellIndex);
                        } else {
                            log.info(row.getCell(cellIndex) + "");
                        }
                        cellIndex++;
                    }


                    if (product.getName() == null || product.getDescription() == null || product.getUnit() == null || productSubCategory.getName() == null || supermarket.getName() == null || productBatchCreate.hasNullField()) {
                        errors.add("Thông tin của sản phẩm có một thông tin bị trống nên không được hệ thống nhận biết!");
                    }

                    if (cellIndex > 0) {

                        Optional<ProductSubCategory> productSubCategoryExistedCheck = productSubCategoryRepository.findByName(productSubCategory.getName());
                        if (productSubCategoryExistedCheck.isPresent()) {
                            productSubCategory = productSubCategoryExistedCheck.get();
                        } else if (productSubCategory.getName() != null) {
                            errors.add("Tên danh mục phụ " + productSubCategory.getName() + " không tìm thấy trong hệ thống!");
                        }

                        Optional<Supermarket> supermarketExistedCheck = supermarketRepository.findByName(supermarket.getName());
                        if (supermarketExistedCheck.isPresent()) {
                            supermarket = supermarketExistedCheck.get();
                        } else if (supermarket.getName() != null) {
                            errors.add("Tên siêu thị " + supermarket.getName() + " không tìm thấy trong hệ thống!");
                        }

                        List<ProductBatchCreateList> productBatches = new ArrayList<>();
                        for (ProductExcelBatchCreate productExcelBatchCreate : productBatchCreateList) {
                            ProductBatchCreateList productBatch = new ProductBatchCreateList();
                            productBatch.setPrice(productExcelBatchCreate.getPrice());
                            productBatch.setPriceOriginal(productExcelBatchCreate.getPriceOriginal());
                            if (productSubCategory.getAllowableDisplayThreshold() != null && productExcelBatchCreate.getExpiredDate() != null && productExcelBatchCreate.getExpiredDate().isBefore(LocalDate.now().plus(productSubCategory.getAllowableDisplayThreshold(), ChronoUnit.DAYS))) {
                                errors.add("HSD(" + productExcelBatchCreate.getExpiredDate() + ") hiện trước ngày hiện tại cộng thêm số ngày điều kiện cho hàng cận hạn sử dụng có trong SUBCATEGORY!");
                            } else {
                                productBatch.setExpiredDate(productExcelBatchCreate.getExpiredDate());
                            }
                            List<ProductBatchAddressCreateList> productBatchAddresses = new ArrayList<>();
                            for (ProductExcelBatchAddressCreate productExcelBatchAddressCreate : productExcelBatchCreate.getProductBatchAddresses()) {
                                ProductBatchAddressCreateList productBatchAddress = new ProductBatchAddressCreateList();
                                Optional<SupermarketAddress> supermarketAddress = supermarketAddressRepository.findByAddress(productExcelBatchAddressCreate.getSupermarketAddress());
                                if (supermarketAddress.isEmpty()) {
                                    errors.add("Địa chỉ kho lưu trữ " + productExcelBatchAddressCreate.getSupermarketAddress() + " không tìm thấy trong hệ thống!");
                                } else if (supermarket.getId() != null && !supermarketAddress.get().getSupermarket().getId().equals(supermarket.getId())) {
                                    errors.add("Địa chỉ kho lưu trữ " + supermarketAddress.get().getAddress() + " không nằm trong danh sách các địa chỉ của siêu thị được chọn!");
                                }
                                productBatchAddress.setQuantity(productExcelBatchAddressCreate.getQuantity());
                                supermarketAddress.ifPresent(productBatchAddress::setSupermarketAddress);
                                productBatchAddresses.add(productBatchAddress);
                            }
                            productBatch.setProductBatchAddresses(productBatchAddresses);
                            productBatches.add(productBatch);
                        }


                        String unit = product.getUnit() != null ? product.getUnit().toLowerCase() : null;
                        product.setUnit(unit);
                        product.setProductBatchList(productBatches);
                        product.setProductSubCategory(productSubCategory);
                        product.setSupermarket(supermarket);

                        ProductExcelCreate productExcelCreate = new ProductExcelCreate();
                        productExcelCreate.setName(product.getName());
                        productExcelCreate.setUnit(product.getUnit());
                        productExcelCreate.setPriceListed(product.getPriceListed());
                        productExcelCreate.setDescription(product.getDescription().trim().replaceAll("\\s+", " "));
                        productExcelCreate.setProductSubCategory(product.getProductSubCategory());
                        productExcelCreate.setSupermarket(product.getSupermarket());

                        if (product.getName() != null && product.getDescription() != null && product.getUnit() != null && product.getProductSubCategory() != null) {
                            List<String> imageUrls = new ArrayList<>();
                            if (productSeenData.add(productExcelCreate)) {
                                if (productImages.get(rowIndex) != null) {
                                    productImages.get(rowIndex).forEach(image ->{
                                        String imageUrl = FirebaseService.uploadImageToStorage(image, "productImage"+ UUID.randomUUID().toString());
                                        imageUrls.add(imageUrl);
                                    });
                                }
                                product.setImageUrls(imageUrls);
                                productList.add(product);
                            } else {
                                for (ProductCreateList p : productList) {
                                    ProductExcelCreate productDuplicate = new ProductExcelCreate();
                                    productDuplicate.setName(p.getName());
                                    productDuplicate.setDescription(p.getDescription());
                                    productDuplicate.setPriceListed(p.getPriceListed());
                                    productDuplicate.setUnit(p.getUnit());
                                    productDuplicate.setProductSubCategory(p.getProductSubCategory());
                                    productDuplicate.setSupermarket(p.getSupermarket());
                                    if (productDuplicate.equals(productExcelCreate)) {
                                        if (productImages.get(rowIndex) != null) {
                                            productImages.get(rowIndex).forEach(image ->{
                                                String imageUrl = FirebaseService.uploadImageToStorage(image, "productImage"+ UUID.randomUUID().toString());
                                                imageUrls.add(imageUrl);
                                            });
                                        }
                                        p.getProductBatchList().addAll(productBatches);
                                        p.getImageUrls().addAll(imageUrls);
                                    }
                                }
                            }
                        } else {
                            productList.add(product);
                        }
                    }

                    if (errors.size() > 0) {
                        errorFields.put(rowIndex, errors);
                    }
                }
                rowIndex++;
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            LinkedHashMap<String, String> errorFieldsFile = new LinkedHashMap<>();
            errorFieldsFile.put("Invalid file type", "File không phải mẫu do hệ thống cung cấp!");
            throw new InvalidExcelFileDataException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFieldsFile);
        }

        if (productList.size() == 0) {
            LinkedHashMap<String, String> errorFieldsFile = new LinkedHashMap<>();
            errorFieldsFile.put("Invalid file type", "File không phải mẫu do hệ thống cung cấp!");
            throw new InvalidExcelFileDataException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFieldsFile);
        }

        Integer rowCheckDuplicateBatch = 0;
        for (ProductCreateList productCreateList : productList) {
            if (hasObjectsWithSameExpiredDate(productCreateList.getProductBatchList())) {
                if (errorFields.get(rowCheckDuplicateBatch) != null) {
                    errorFields.get(rowCheckDuplicateBatch).add("Sản phẩm có tồn tại 2 hay nhiều lô hàng có cùng HSD!");
                } else {
                    List<String> errors = new ArrayList<>();
                    errors.add("Sản phẩm có tồn tại 2 hay nhiều lô hàng có cùng HSD!");
                    errorFields.put(rowCheckDuplicateBatch, errors);
                }
            }
            rowCheckDuplicateBatch++;
        }

        return new ProductExcelResponse(productList, errorFields);
    }

    private static boolean hasObjectsWithSameExpiredDate(List<ProductBatchCreateList> objectList) {
        Map<LocalDate, List<ProductBatchCreateList>> groupedByExpiredDate = objectList.stream()
                .collect(Collectors.groupingBy(ProductBatchCreateList::getExpiredDate));

        return groupedByExpiredDate.values().stream()
                .anyMatch(objects -> objects.size() > 1);
    }

    private static boolean isXLSXFile(MultipartFile file) {
        try {
            new XSSFWorkbook(file.getInputStream());
            return true; // Successfully opened as XLSX workbook
        } catch (Exception e) {
            return false; // Failed to open as XLSX workbook
        }
    }

    private static boolean isXLSFile(MultipartFile file) {
        try {
            new HSSFWorkbook(file.getInputStream());
            return true; // Successfully opened as XLS workbook
        } catch (Exception e) {
            return false; // Failed to open as XLS workbook
        }
    }

    private static void validateAndGetProductData(ProductCreateList product,
                                                  Row titleRow, Cell cell, List<String> errors, int cellIndex) {


        switch (titleRow.getCell(cellIndex).toString().trim().replaceAll("\\s+", " ")) {
            case "Tên":
                if (cell.getCellType().equals(CellType.STRING)) {
                    String productName = cell.getStringCellValue();
                    if (productName != null && !productName.trim().isEmpty()) {
                        if (productName.length() > 50) {
                            errors.add("Tên sản phẩm có quá 50 kí tự!");
                        } else {
                            product.setName(productName.trim().replaceAll("\\s+", " "));
                        }
                    }
                } else {
                    putFormatError(errors, titleRow.getCell(cellIndex).toString(), CellType.STRING);
                }
                break;
            case "Mô tả sản phẩm":
                if (cell.getCellType().equals(CellType.STRING)) {
                    product.setDescription(cell.getStringCellValue().trim().replaceAll("\\s+", " "));
                } else {
                    putFormatError(errors, titleRow.getCell(cellIndex).toString(), CellType.STRING);
                }
                break;
            case "Giá niêm yết":
                if (cell.getCellType().equals(CellType.NUMERIC)) {
                    int priceListed = (int) cell.getNumericCellValue();
                    if (priceListed < 0) {
                        errors.add("Giá niêm yết " + cell.getNumericCellValue() + " đang âm!");
                    } else {
                        product.setPriceListed(priceListed);
                    }
                } else {
                    putFormatError(errors, titleRow.getCell(cellIndex).toString(), CellType.NUMERIC);
                }
                break;
            case "Đơn vị":
                if (cell.getCellType().equals(CellType.STRING)) {
                    String productUnit = cell.getStringCellValue();
                    if (productUnit != null && !productUnit.trim().isEmpty()) {
                        if (productUnit.length() > 50) {
                            errors.add("Đơn vị có quá 50 kí tự!");
                        } else {
                            product.setUnit(productUnit.trim().replaceAll("\\s+", " "));
                        }
                    }
                } else {
                    putFormatError(errors, titleRow.getCell(cellIndex).toString(), CellType.STRING);
                }
                break;
        }
    }

    private static void validateAndGetProductBatchData(ProductExcelBatchCreate productBatchCreate, List<ProductExcelBatchCreate> productBatchList,
                                                       Row titleRow, Cell cell, List<String> errors, int cellIndex) {
        switch (titleRow.getCell(cellIndex).toString().trim().replaceAll("\\s+", " ")) {
            case "Giá bán":
                if (cell.getCellType().equals(CellType.NUMERIC)) {
                    int price = (int) cell.getNumericCellValue();
                    if (price < 0) {
                        errors.add("Giá bán " + cell.getNumericCellValue() + " của lô sản phẩm HSD(" + productBatchCreate.getExpiredDate().toString() + ") đang âm!");
                    } else {
                        productBatchCreate.setPrice(price);
                    }
                } else {
                    putFormatError(errors, titleRow.getCell(cellIndex).toString(), CellType.NUMERIC);
                }
                break;
            case "Giá gốc":
                if (cell.getCellType().equals(CellType.NUMERIC)) {
                    int priceOriginal = (int) cell.getNumericCellValue();
                    if (priceOriginal < 0) {
                        errors.add("Giá gốc " + cell.getNumericCellValue() + " của lô sản phẩm HSD(" + productBatchCreate.getExpiredDate().toString() + ") đang âm!");
                    } else {
                        productBatchCreate.setPriceOriginal(priceOriginal);
                    }
                } else {
                    putFormatError(errors, titleRow.getCell(cellIndex).toString(), CellType.NUMERIC);
                }
                break;
            case "HSD":
                if (cell.getCellType().equals(CellType.NUMERIC)) {
                    if (DateUtil.isCellDateFormatted(cell)) {
                        productBatchCreate.setExpiredDate(convertDateToLocalDate(cell.getDateCellValue()));
                    } else {
                        errors.add("HSD " + cell.getNumericCellValue() + " không có định dạng ngày tháng năm đúng!");
                    }
                }
                break;
            case "Địa chỉ kho lưu giữ + số lượng":
                if (cell.getCellType().equals(CellType.STRING)) {
                    List<ProductExcelBatchAddressCreate> productBatchAddresses = new ArrayList<>();
                    String[] addressesQuantityBatches = cell.getStringCellValue().split("\n");
                    if (addressesQuantityBatches.length == 0) {
                        errors.add("Địa chỉ kho lưu giữ + số lượng (" + cell.getStringCellValue() + ") không đúng cách nhập để có thể nhận biết được thông tin!");
                    } else {
                        for (String addressesQuantityBatch : addressesQuantityBatches) {
                            String[] addressesQuantityBatchSplit = addressesQuantityBatch.split(";");
                            if (addressesQuantityBatchSplit.length == 0) {
                                errors.add("Địa chỉ kho lưu giữ + số lượng(" + addressesQuantityBatch + ") không đúng cách nhập để có thể nhận biết được thông tin!");
                            } else if (Arrays.stream(addressesQuantityBatchSplit).toList().size() == 2) {
                                String address = addressesQuantityBatchSplit[0];
                                String quantity = addressesQuantityBatchSplit[1];
                                ProductExcelBatchAddressCreate productBatchAddress = new ProductExcelBatchAddressCreate();
                                productBatchAddress.setQuantity(Integer.valueOf(quantity.trim().replaceAll("\\s+", " ")));
                                productBatchAddress.setSupermarketAddress(address.trim().replaceAll("\\s+", " "));
                                productBatchAddresses.add(productBatchAddress);
                            } else {
                                errors.add("Địa chỉ kho lưu giữ + số lượng (" + addressesQuantityBatch + ") không đúng cách nhập để có thể nhận biết được thông tin!");
                            }
                        }
                        productBatchCreate.setProductBatchAddresses(productBatchAddresses);
                        productBatchList.add(productBatchCreate);
                    }

                } else {
                    putFormatError(errors, titleRow.getCell(cellIndex).toString(), CellType.STRING);
                }
                break;
        }
    }

    private static void validateAndGetProductSubCateData(ProductSubCategory productSubCategory,
                                                         Row titleRow, Cell cell, List<String> errors, int cellIndex) {
        switch (titleRow.getCell(cellIndex).toString().trim().replaceAll("\\s+", " ")) {
            case "Danh mục phụ":
                if (cell.getCellType().equals(CellType.STRING)) {
                    String productSubCateName = cell.getStringCellValue();
                    if (productSubCateName != null && !productSubCateName.trim().isEmpty()) {
                        if (productSubCateName.length() > 50) {
                            errors.add("Tên danh mục phụ có quá 50 kí tự!");
                        } else {
                            productSubCategory.setName(productSubCateName.trim().replaceAll("\\s+", " "));
                        }
                    }
                } else {
                    putFormatError(errors, titleRow.getCell(cellIndex).toString(), CellType.STRING);
                }
                break;
        }
    }

    private static void validateAndGetSupermarketData(Supermarket supermarket, Row titleRow,
                                                      Cell cell, List<String> errors, int cellIndex) {
        switch (titleRow.getCell(cellIndex).toString().trim().replaceAll("\\s+", " ")) {
            case "Siêu thị":
                if (cell.getCellType().equals(CellType.STRING)) {
                    String supermarketName = cell.getStringCellValue();
                    if (supermarketName != null && !supermarketName.trim().isEmpty()) {
                        if (supermarketName.length() > 50) {
                            errors.add("Tên siêu thị có quá 50 kí tự!");
                        } else {
                            supermarket.setName(supermarketName.trim().replaceAll("\\s+", " "));
                        }
                    }
                } else {
                    putFormatError(errors, titleRow.getCell(cellIndex).toString(), CellType.STRING);
                }
                break;
        }
    }

    private static void putFormatError(List<String> errors, String title, CellType cellType) {
        switch (cellType) {
            case STRING -> errors.add(title + " có định dạng không phải là Chữ");
            case NUMERIC -> errors.add(title + " có định dạng không phải là Số");
        }
    }

    private static LocalDate convertDateToLocalDate(Date date) {
        // Convert Date to GregorianCalendar
        GregorianCalendar calendar = new GregorianCalendar();
        calendar.setTime(date);

        // Convert GregorianCalendar to Instant
        Instant instant = calendar.toInstant();

        // Convert Instant to LocalDateTime
        LocalDate localDate = LocalDate.from(instant.atZone(ZoneId.systemDefault()).toLocalDateTime());

        return localDate;
    }

}
