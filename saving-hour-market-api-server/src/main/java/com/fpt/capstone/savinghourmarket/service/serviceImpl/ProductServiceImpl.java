package com.fpt.capstone.savinghourmarket.service.serviceImpl;

import com.fpt.capstone.savinghourmarket.common.*;
import com.fpt.capstone.savinghourmarket.entity.Product;
import com.fpt.capstone.savinghourmarket.entity.ProductCategory;
import com.fpt.capstone.savinghourmarket.entity.ProductSubCategory;
import com.fpt.capstone.savinghourmarket.entity.Supermarket;
import com.fpt.capstone.savinghourmarket.exception.InvalidExcelFileDataException;
import com.fpt.capstone.savinghourmarket.exception.InvalidInputException;
import com.fpt.capstone.savinghourmarket.exception.ItemNotFoundException;
import com.fpt.capstone.savinghourmarket.exception.ResourceNotFoundException;
import com.fpt.capstone.savinghourmarket.model.ProductCateWithSubCate;
import com.fpt.capstone.savinghourmarket.model.ProductCreate;
import com.fpt.capstone.savinghourmarket.model.ProductListResponseBody;
import com.fpt.capstone.savinghourmarket.model.ProductSubCateOnly;
import com.fpt.capstone.savinghourmarket.model.*;
import com.fpt.capstone.savinghourmarket.repository.ProductCategoryRepository;
import com.fpt.capstone.savinghourmarket.repository.ProductRepository;
import com.fpt.capstone.savinghourmarket.repository.ProductSubCategoryRepository;
import com.fpt.capstone.savinghourmarket.repository.SupermarketRepository;
import com.fpt.capstone.savinghourmarket.service.FirebaseService;
import com.fpt.capstone.savinghourmarket.service.ProductCategoryService;
import com.fpt.capstone.savinghourmarket.service.ProductService;
import com.fpt.capstone.savinghourmarket.service.ProductSubCategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.PackagePart;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFPictureData;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
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
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.time.LocalDate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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

    @Override
    public ProductListResponseBody getProductsForStaff(Boolean isExpiredShown, String name, String supermarketId, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, SortType quantitySortType, SortType expiredSortType, SortType priceSort) {
        Sort sortable = Sort.by("expiredDate").ascending();
//        if(quantitySortType.equals("ASC") ){
//            sortable = Sort.by("expiredDate").ascending();
//        }else if (quantitySortType.equals("DESC")) {
//            sortable = Sort.by("expiredDate").ascending();
//        }else if (quantitySortType.equals("ASC")){
//            sortable = Sort.by("expiredDate").ascending();
//        }else {
//            sortable = Sort.by("expiredDate").descending();
//        }

        if (quantitySortType != null) {
            sortable = quantitySortType.toString().equals("ASC") ? Sort.by("quantity").ascending() : Sort.by("quantity").descending();
        }

        if (priceSort != null) {
            sortable = priceSort.toString().equals("ASC") ? Sort.by("price").ascending() : Sort.by("price").descending();
        }

        if (expiredSortType != null) {
            sortable = expiredSortType.toString().equals("ASC") ? Sort.by("expiredDate").ascending() : Sort.by("expiredDate").descending();
        }

        Pageable pageableWithSort = PageRequest.of(page, limit, sortable);
        Page<Product> result = productRepository.getProductsForStaff(supermarketId == null ? null : UUID.fromString(supermarketId)
                , name
                , productCategoryId == null ? null : UUID.fromString(productCategoryId)
                , productSubCategoryId == null ? null : UUID.fromString(productSubCategoryId)
                , isExpiredShown
                , pageableWithSort);

        int totalPage = result.getTotalPages();
        long totalProduct = result.getTotalElements();

        List<Product> productList = result.stream().toList();

        return new ProductListResponseBody(productList, totalPage, totalProduct);
    }

    @Override
    public ProductListResponseBody getProductsForCustomer(String name, String supermarketId, String productCategoryId, String productSubCategoryId, Integer page, Integer limit, SortType quantitySortType, SortType expiredSortType, SortType priceSort) {
        Sort sortable = Sort.by("expiredDate").ascending();

        if (quantitySortType != null) {
            sortable = quantitySortType.toString().equals("ASC") ? Sort.by("quantity").ascending() : Sort.by("quantity").descending();
        }

        if (priceSort != null) {
            sortable = priceSort.toString().equals("ASC") ? Sort.by("price").ascending() : Sort.by("price").descending();
        }

        if (expiredSortType != null) {
            sortable = expiredSortType.toString().equals("ASC") ? Sort.by("expiredDate").ascending() : Sort.by("expiredDate").descending();
        }

        Pageable pageableWithSort = PageRequest.of(page, limit, sortable);
        Page<Product> result = productRepository.getProductsForCustomer(supermarketId == null ? null : UUID.fromString(supermarketId)
                , name
                , productCategoryId == null ? null : UUID.fromString(productCategoryId)
                , productSubCategoryId == null ? null : UUID.fromString(productSubCategoryId)
                , pageableWithSort);

        int totalPage = result.getTotalPages();
        long totalProduct = result.getTotalElements();

        List<Product> productList = result.stream().toList();

        return new ProductListResponseBody(productList, totalPage, totalProduct);
    }

    @Override
    public SaleReportResponseBody getSaleReportSupermarket(UUID supermarketId, Month month, Quarter quarter, Integer year) {
        LocalDate currentDate = LocalDate.now();
        if (!supermarketRepository.findById(supermarketId).isPresent()) {
            throw new ItemNotFoundException(HttpStatus.valueOf(AdditionalResponseCode.SUPERMARKET_NOT_FOUND.getCode()), AdditionalResponseCode.SUPERMARKET_NOT_FOUND.toString());
        }
        if (year == null) {
            year = currentDate.getYear();
        }

        HashMap<UUID, Product> productSaleReportHashMap = new HashMap<>();
        List<Product> rawProudProductList = productRepository.getRawProductFromSupermarketId(supermarketId);


        SaleReportResponseBody saleReportResponseBody = new SaleReportResponseBody();
        List<Product> productEntityReportList = productRepository.getProductsReportForSupermarket(supermarketId, month == null ? null : month.getMonthInNumber(), quarter == null ? null : quarter.getQuarterInNumber(), year);
        for (Product product : productEntityReportList) {
            productSaleReportHashMap.put(product.getId(), product);
        }

        for (Product rawProduct : rawProudProductList) {
            // product sale map
            if (productSaleReportHashMap.containsKey(rawProduct.getId())) {
                saleReportResponseBody.getProductSaleReportList().add(new ProductSaleReport(rawProduct, productSaleReportHashMap.get(rawProduct.getId()).getPrice(), productSaleReportHashMap.get(rawProduct.getId()).getQuantity()));
                saleReportResponseBody.setTotalSale(saleReportResponseBody.getTotalSale() + productSaleReportHashMap.get(rawProduct.getId()).getQuantity());
                saleReportResponseBody.setTotalIncome(saleReportResponseBody.getTotalIncome() + productSaleReportHashMap.get(rawProduct.getId()).getPrice());
            } else {
                saleReportResponseBody.getProductSaleReportList().add(new ProductSaleReport(rawProduct, 0, 0));
            }
        }

        saleReportResponseBody.getProductSaleReportList().sort((o1, o2) -> o2.getSoldQuantity() - o1.getSoldQuantity());

//        productEntityReportList.stream().forEach(product -> {
//            saleReportResponseBody.getProductSaleReportList().add(new ProductSaleReport(product));
//            saleReportResponseBody.setTotalSale(saleReportResponseBody.getTotalSale() + product.getQuantity());
//            saleReportResponseBody.setTotalIncome(saleReportResponseBody.getTotalIncome() + product.getPrice());
//        });
        return saleReportResponseBody;
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
    public List<ProductCateWithSubCate> getAllCategory() {
        List<ProductCateWithSubCate> productCategoryList = productCategoryRepository.getAllProductCategoryWithSubCate();
        return productCategoryList;
    }

    @Override
    public List<ProductSubCateOnly> getAllSubCategory() {
        List<ProductSubCateOnly> productSubCateOnlyList = productSubCategoryRepository.findAllSubCategoryOnly();
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
    @Transactional
    public Product createProduct(ProductCreate productCreate) throws ResourceNotFoundException {
        HashMap<String, String> errorFields = new HashMap<>();
        Product product = new Product();
        if (productCreate.getName().length() > 50) {
            errorFields.put("Lỗi nhập tên sản phẩm", "Tên sản phẩm chỉ có tối đa 50 kí tự!");
        }

        if (productCreate.getPrice() < 0 || productCreate.getPriceOriginal() < 0) {
            errorFields.put("Lỗi nhập giá", "Giá bán không thế âm!");
        }

        if (productCreate.getQuantity() <= 0) {
            errorFields.put("Lỗi nhập số lượng", "Số lượng sản phẩm không thể âm hoặc bằng 0!");
        }

        if (productCreate.getExpiredDate().isBefore(LocalDateTime.now().plus(productCreate.getProductSubCategory().getAllowableDisplayThreshold(), ChronoUnit.DAYS))) {
            errorFields.put("Lỗi nhập ngày hết hạn", "Ngày hết hạn phải sau ngày hiện tại cộng thêm số ngày điều kiện cho hàng cận hạn sử dụng có trong SUBCATEGORY!");
        }

        if (productCreate.getProductSubCategory().getId() == null && productCreate.getProductSubCategory().getName().length() > 50) {
            errorFields.put("Lỗi nhập tên SubCategory", "Tên sản phẩm chỉ có tối đa 50 kí tự!");
        }

        if (productCreate.getProductSubCategory().getId() == null && productCreate.getProductSubCategory().getAllowableDisplayThreshold() <= 0) {
            errorFields.put("Lỗi nhập AllowableDisplayThreshold", "AllowableDisplayThreshold không thể âm hoặc bằng 0!");
        }

        if (productCreate.getProductSubCategory().getId() == null && productCreate.getProductSubCategory().getProductCategory().getName().length() > 50) {
            errorFields.put("Lỗi nhập tên category", "Tên category chỉ có tối đa 50 kí tự!");
        }

        if (productCreate.getSupermarket().getId() == null && productCreate.getSupermarket().getName().length() > 50) {
            errorFields.put("Lỗi nhập tên siêu thị", "Tên siêu thị chỉ có tối đa 50 kí tự!");
        }

        if (productCreate.getSupermarket().getId() == null && productCreate.getSupermarket().getAddress().length() > 255) {
            errorFields.put("Lỗi nhập tên siêu thị", "Địa chỉ siêu thị chỉ có tối đa 255 kí tự!");
        }

        Pattern pattern;
        Matcher matcher;
        pattern = Pattern.compile("^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$");
        matcher = pattern.matcher(productCreate.getSupermarket().getPhone());
        if (!matcher.matches()) {
            errorFields.put("Lỗi nhập số điện thoại siêu thị", "Số điện thoại siêu thị không hợp lệ!");
        }


        if (errorFields.size() > 0) {
            throw new InvalidInputException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        ModelMapper modelMapper = new ModelMapper();
        modelMapper.map(productCreate, product);
        product.setStatus(Status.ENABLE.ordinal());
        product.getSupermarket().setStatus(Status.ENABLE.ordinal());

        //Save new product Category if id is null
        UUID productCategoryId = product.getProductSubCategory().getProductCategory().getId();
        if (productCategoryId != null) {
            product.getProductSubCategory()
                    .setProductCategory(productCategoryRepository.findById(productCategoryId)
                            .orElseThrow(() -> new ResourceNotFoundException("Product Sub Category không tìm thấy với id: " + productCategoryId)));
        } else {
            productCategoryRepository.save(product.getProductSubCategory().getProductCategory());
        }

        //Save new product sub Category if id is null
        UUID productSubCategoryId = product.getProductSubCategory().getId();
        product.setProductSubCategory(productSubCategoryId != null ?
                productSubCategoryRepository.findById(productSubCategoryId)
                        .orElseThrow(() -> new ResourceNotFoundException("Product Sub Category không tìm thấy với id: " + productSubCategoryId))
                :
                productSubCategoryRepository.save(product.getProductSubCategory()));

        //Save new supermarket if id is null
        UUID supermarketId = product.getSupermarket().getId();
        product.setSupermarket(supermarketId != null ?
                supermarketRepository.findById(supermarketId)
                        .orElseThrow(() -> new ResourceNotFoundException("Supermarket không tìm thấy với id: " + supermarketId))
                :
                supermarketRepository.save(product.getSupermarket()));

        return productRepository.save(product);
    }

    @Override
    public List<Product> createProductByExcel(MultipartFile file) throws IOException, InvalidExcelFileDataException, InvalidFormatException {
        List<Product> productList = new ArrayList();
        LinkedHashMap<String, String> errorFields = new LinkedHashMap<>();

        Workbook workbook = new XSSFWorkbook(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);
        //Get first row as title
        Row titleRow = sheet.getRow(0);
        int rowIndex = 0;
        for (Row row : sheet) {
            if (rowIndex != 0) {
                Product product = new Product();
                ProductCategory productCategory = new ProductCategory();
                ProductSubCategory productSubCategory = new ProductSubCategory();
                Supermarket supermarket = new Supermarket();
                int cellIndex = 0;
                for (Cell cell : row) {
                    log.info(titleRow.getCell(cellIndex) + ", " + row.getCell(cellIndex));
                    validateAndGetProductData(sheet, product, row, titleRow, cell, errorFields, cellIndex);
                    validateAndGetProductSubCateData(sheet, productSubCategory, productCategory, row, titleRow, cell, errorFields, cellIndex);
                    validateAndGetSupermarketData(supermarket, row, titleRow, cell, errorFields, cellIndex);
                    cellIndex++;
                }
                if (productSubCategory.getAllowableDisplayThreshold() != null && product.getExpiredDate() != null && product.getExpiredDate().isBefore(LocalDateTime.now().plus(productSubCategory.getAllowableDisplayThreshold(), ChronoUnit.DAYS))) {
                    errorFields.put("Lỗi nhập ngày hết hạn tại STT " + row.getCell(0), "Ngày hết hạn phải sau ngày hiện tại cộng thêm số ngày điều kiện cho hàng cận hạn sử dụng có trong SUBCATEGORY!");
                }

                product.setStatus(Status.ENABLE.ordinal());
                productSubCategory.setProductCategory(productCategory);
                product.setProductSubCategory(productSubCategory);
                product.setSupermarket(supermarket);
                productList.add(product);
            }
            rowIndex++;
        }

        if (errorFields.size() > 0) {
            throw new InvalidExcelFileDataException(HttpStatus.UNPROCESSABLE_ENTITY, HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase().toUpperCase().replace(" ", "_"), errorFields);
        }

        return productList;
    }

    private static void validateAndGetProductData(Sheet sheet, Product product, Row row, Row titleRow, Cell cell, LinkedHashMap<String, String> errorFields, int cellIndex) throws InvalidFormatException {
        XSSFSheet xssfSheet = (XSSFSheet) sheet;
        List<XSSFPictureData> pictures = xssfSheet.getWorkbook().getAllPictures();
        Pattern pattern;
        Matcher matcher;
        switch (titleRow.getCell(cellIndex).toString()) {
            case "Tên":
                if (cell.getCellType().equals(CellType.STRING)) {
                    String productName = cell.getStringCellValue();
                    if (productName.length() > 50) {
                        putValidateDataError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString());
                    } else {
                        product.setName(productName);
                    }
                } else {
                    putFormatError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString(), CellType.STRING);
                }
                break;
            case "Giá bán":
                if (cell.getCellType().equals(CellType.NUMERIC)) {
                    int price = (int) cell.getNumericCellValue();
                    if (price < 0) {
                        putValidateDataError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString());
                    } else {
                        product.setPrice(price);
                    }
                } else {
                    putFormatError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString(), CellType.NUMERIC);
                }
                break;
            case "Giá gốc":
                if (cell.getCellType().equals(CellType.NUMERIC)) {
                    int priceOriginal = (int) cell.getNumericCellValue();
                    if (priceOriginal < 0) {
                        putValidateDataError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString());
                    } else {
                        product.setPriceOriginal(priceOriginal);
                    }
                } else {
                    putFormatError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString(), CellType.NUMERIC);
                }
                break;
            case "Mô tả sản phẩm":
                if (cell.getCellType().equals(CellType.STRING)) {
                    product.setDescription(cell.getStringCellValue());
                } else {
                    putFormatError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString(), CellType.STRING);
                }
                break;
            case "Ngày HSD":
                if (cell.getCellType().equals(CellType.NUMERIC)) {
                    if (DateUtil.isCellDateFormatted(cell)) {
                        product.setExpiredDate(convertDateToLocalDateTime(cell.getDateCellValue()));
                    } else {
                        putValidateDataError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString());
                    }
                } else {
                    putFormatError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString(), CellType.NUMERIC);
                }
                break;
            case "Số lượng":
                if (cell.getCellType().equals(CellType.NUMERIC)) {
                    int priceOriginal = (int) cell.getNumericCellValue();
                    if (priceOriginal < 0) {
                        putValidateDataError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString());
                    } else {
                        product.setQuantity(priceOriginal);
                    }
                } else {
                    putFormatError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString(), CellType.NUMERIC);
                }

                break;
            case "Ảnh sản phẩm":
                XSSFRichTextString imageProduct = (XSSFRichTextString) cell.getRichStringCellValue();
                // Use regular expressions to find image file names
                pattern = Pattern.compile("image(\\d+)\\.(\\w+)");
                matcher = pattern.matcher(imageProduct.getString());

                while (matcher.find()) {
                    String imageName = matcher.group();
                    byte[] imageBytes = getImageBytes(xssfSheet, imageName);
                    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                    byteArrayOutputStream.write(imageBytes, 0, imageBytes.length);

                    if (imageBytes != null) {
                        String imageUrl = FirebaseService.uploadImageToStorage(byteArrayOutputStream, imageName);
                        product.setImageUrl(imageUrl);
                    }
                }
                break;
        }
    }

    private static void validateAndGetProductSubCateData(Sheet sheet, ProductSubCategory productSubCategory, ProductCategory productCategory, Row row, Row titleRow, Cell cell, LinkedHashMap<String, String> errorFields, int cellIndex) throws InvalidFormatException {
        XSSFSheet xssfSheet = (XSSFSheet) sheet;
        List<XSSFPictureData> pictures = xssfSheet.getWorkbook().getAllPictures();
        Pattern pattern;
        Matcher matcher;
        switch (titleRow.getCell(cellIndex).toString()) {
            case "Tên loại sản phẩm":
                if (cell.getCellType().equals(CellType.STRING)) {
                    String productCateName = cell.getStringCellValue();
                    if (productCateName.length() > 50) {
                        putValidateDataError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString());
                    } else {
                        productCategory.setName(productCateName);
                    }
                } else {
                    putFormatError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString(), CellType.STRING);
                }

                break;
            case "Số ngày quy định cho hàng cận hạn":
                if (cell.getCellType().equals(CellType.NUMERIC)) {
                    int allowableDisplayThreshold = (int) cell.getNumericCellValue();
                    if (allowableDisplayThreshold < 0) {
                        putValidateDataError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString());
                    } else {
                        productSubCategory.setAllowableDisplayThreshold(allowableDisplayThreshold);
                    }
                } else {
                    putFormatError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString(), CellType.NUMERIC);
                }

                break;
            case "Tên loại sản phẩm phụ":
                if (cell.getCellType().equals(CellType.STRING)) {
                    String productSubCateName = cell.getStringCellValue();
                    if (productSubCateName.length() > 50) {
                        putValidateDataError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString());
                    } else {
                        productSubCategory.setName(productSubCateName);
                    }
                } else {
                    putFormatError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString(), CellType.STRING);
                }

                break;
            case "Ảnh loại sản phẩm phụ":
                XSSFRichTextString imageSubCate = (XSSFRichTextString) cell.getRichStringCellValue();
                // Use regular expressions to find image file names
                pattern = Pattern.compile("image(\\d+)\\.(\\w+)");
                matcher = pattern.matcher(imageSubCate.getString());

                while (matcher.find()) {
                    String imageName = matcher.group();
                    byte[] imageBytes = getImageBytes(xssfSheet, imageName);
                    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                    byteArrayOutputStream.write(imageBytes, 0, imageBytes.length);

                    if (imageBytes != null) {
                        String imageUrl = FirebaseService.uploadImageToStorage(byteArrayOutputStream, imageName);
                        productSubCategory.setImageUrl(imageUrl);
                    }
                }
                break;
        }
    }

    private static void validateAndGetSupermarketData(Supermarket supermarket, Row row, Row titleRow, Cell cell, LinkedHashMap<String, String> errorFields, int cellIndex) throws InvalidFormatException {
        Pattern pattern;
        Matcher matcher;
        switch (titleRow.getCell(cellIndex).toString()) {
            case "Tên siêu thị":
                if (cell.getCellType().equals(CellType.STRING)) {
                    String supermarketName = cell.getStringCellValue();
                    if (supermarketName.length() > 50) {
                        putValidateDataError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString());
                    } else {
                        supermarket.setName(supermarketName);
                    }
                } else {
                    putFormatError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString(), CellType.STRING);
                }
                break;
            case "Địa chỉ siêu thị":
                if (cell.getCellType().equals(CellType.STRING)) {
                    String supermarketAddress = cell.getStringCellValue();
                    if (supermarketAddress.length() > 255) {
                        putValidateDataError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString());
                    } else {
                        supermarket.setAddress(supermarketAddress);
                    }
                } else {
                    putFormatError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString(), CellType.STRING);
                }
                break;
            case "Hotline siêu thị":
                if (cell.getCellType().equals(CellType.STRING)) {
                    pattern = Pattern.compile("^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$");
                    matcher = pattern.matcher(cell.getStringCellValue());
                    if (!matcher.matches()) {
                        putValidateDataError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString());
                    } else {
                        supermarket.setPhone(cell.getStringCellValue());
                    }
                } else {
                    putFormatError(errorFields, row.getCell(0).toString(), titleRow.getCell(cellIndex).toString(), CellType.STRING);
                }
                break;
        }
    }

    private static void putFormatError(LinkedHashMap<String, String> errorFields, String STT, String title, CellType cellType) {
        switch (cellType) {
            case STRING ->
                    errorFields.put("Lỗi định dạng " + title + " tại STT " + STT, title + " có định dạng không phải là Chữ");
            case NUMERIC ->
                    errorFields.put("Lỗi định dạng " + title + " tại STT " + STT, title + " có định dạng không phải là Số");
        }
    }

    private static void putValidateDataError(LinkedHashMap<String, String> errorFields, String STT, String title) {
        switch (title) {
            case "Tên":
                errorFields.put("Lỗi xứ lí tên sản phẩm tại STT " + STT, title + " có quá 50 kí tự!");
                break;
            case "Giá bán":
                errorFields.put("Lỗi xứ lí giá bán sản phẩm tại STT " + STT, title + " đang âm!");
                break;
            case "Giá gốc":
                errorFields.put("Lỗi xứ lí giá gốc sản phẩm tại STT " + STT, title + " đang âm!");
                break;
            case "Mô tả sản phẩm":
                break;
            case "Ngày HSD":
                errorFields.put("Lỗi xử lí HSD sản phẩm tại STT " + STT, title + "không phải là " + " dữ liệu dạng DATE");
                break;
            case "Số lượng":
                errorFields.put("Lỗi xứ lí số lượng sản phẩm tại STT " + STT, title + " đang âm!");
                break;
            case "Ảnh sản phẩm":
                break;
            case "Tên loại sản phẩm":
                errorFields.put("Lỗi xứ lí tên loại sản phẩm tại STT " + STT, title + " có quá 50 kí tự!");
                break;
            case "Số ngày quy định cho hàng cận hạn":
                errorFields.put("Lỗi xứ lí số ngày quy định cho hàng cận hạn tại STT " + STT, title + " đang là số âm!");
                break;
            case "Tên loại sản phẩm phụ":
                errorFields.put("Lỗi xứ lí tên loại sản phẩm phụ tại STT " + STT, title + " có quá 50 kí tự!");
                break;
            case "Ảnh loại sản phẩm phụ":
                break;
            case "Tên siêu thị":
                errorFields.put("Lỗi xứ lí Tên siêu thị phụ tại STT " + STT, title + " có quá 50 kí tự!");
                break;
            case "Địa chỉ siêu thị":
                errorFields.put("Lỗi xứ lí Địa chỉ siêu thị tại STT " + STT, title + " có quá 255 kí tự!");
                break;
            case "Hotline siêu thị":
                errorFields.put("Lỗi nhập số điện thoại siêu thị tại STT " + STT, title + " không hợp lệ!");
                break;
        }
    }

    private static byte[] getImageBytes(XSSFSheet sheet, String imageName) throws InvalidFormatException {
        List<PackagePart> packageParts = sheet.getPackagePart().getPackage().getParts();
        for (PackagePart part : packageParts) {
            String partName = part.getPartName().getName();
            if (partName.contains(imageName)) {
                try {
                    return part.getInputStream().readAllBytes();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return null;
    }

    private static LocalDateTime convertDateToLocalDateTime(Date date) {
        // Convert Date to GregorianCalendar
        GregorianCalendar calendar = new GregorianCalendar();
        calendar.setTime(date);

        // Convert GregorianCalendar to Instant
        Instant instant = calendar.toInstant();

        // Convert Instant to LocalDateTime
        LocalDateTime localDateTime = instant.atZone(ZoneId.systemDefault()).toLocalDateTime();

        return localDateTime;
    }

}
