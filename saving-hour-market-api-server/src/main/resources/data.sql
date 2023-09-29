-- Satus: enable(1), disable(0)
SET @enable = 1;
SET @disable = 0;

-- Gender: Female(1), Male(0)
SET @female = 1;
SET @male = 0;

-- System status: Active(1), Maintaining(0)
SET @systemActive = 1;
SET @SystemMaintaining = 0;

-- Order status:
SET @processing = 0;
SET @packaging = 1;
SET @packaged = 2;
SET @delivering = 3;
SET @success = 4;
SET @fail = 5;
SET @cancel = 6;

-- Payment method: COD(0), VNPay(1)
SET @cod = 0;
SET @vnpay = 1;

-- Payment status: unpaid(0), paid(1)
SET @unpaid = 0;
SET @paid = 1;

-- Product description
SET @OmoDescription = 'Nước Giặt Omo Matic với công nghệ Màn chắn Kháng bẩn Polyshield Xanh, giúp bao bọc và phủ một lớp màn chắn vô hình lên bề mặt sợi vải, loại bỏ nhanh chóng vết bẩn cứng đầu và mùi hôi trên áo quần.
\nBền Màu sau 100 lần giặt
\nChuyên dụng cho máy giặt cửa trước
\n11 Hãng máy giặt hàng đầu tin dùng như AQUA, LG, Panasonic
\nThân thiện môi trường với hoạt chất phân huỷ sinh học
\nOMO tự hào cùng các bé lấm bẩn trồng cây, kiến tạo thêm nhiều màn chắn xanh cho Việt Nam';

SET @ChaGioTomCuaDescription = 'Chả giò tôm cua Vissan được sản xuất theo quy trình khép kín với những nguyên liệu tự nhiên, được chọn lựa kỹ lưỡng từ khâu chọn lựa đến khâu chế biến đảm bảo chất lượng người tiêu dùng. Với chả giò tôm cua người dùng sẽ cảm nhận được vị thịt tôm và cua tự nhiên, hương vị của các loại gia vị hòa quyện, giòn rụm của bánh đa khó quên.
\nSản phẩm được đóng gói an toàn, cuốn sẵn tiện dụng chỉ việc cho vào rán kèm nước chấm pha sẵn thơm ngon đặc trưng, tiện dụng cho bữa cơm của gia đình bạn.
\n\nThành phần: Bánh tráng (gạo, nước, bột năng, muối), tôm (20%), cua (10%), nạc heo, mỡ heo, tôm, củ sắn, khoai môn, hành, tỏi, nấm mèo, bún tàu, đường, muối i-ốt, tiêu, chất điều vị (621).';

SET @GioHeoXongKhoi = 'Được chế biến từ thành phần thịt heo rút xương tươi ngon, đảm bảo an toàn vệ sinh thức phẩm. Sản phẩm không chứa hóa chất bảo quản, chất phụ gia ảnh hưởng đến sức khỏe người tiêu dùng. Với những bà nội trợ luôn bận rộn, không có nhiều thời gian để nấu nướng thì sản phẩm chính là sự lựa chọn thích hợp.
\n\nThành phần: Giò heo rút xương (85%), nước, muối i-ốt (muối, kali iodat), đường, chất điều vị (621), chất giữ ẩm (451i, 452i), hương khói tự nhiên, chất điều chỉnh độ acid (262i), chất chống oxy hóa (316).';

SET @KemWallOreo = 'Kem Wall’s Tub Oreo Cookies được sản xuất trên dây chuyền công nghệ hiện đại, sử dụng nguyên liệu tự nhiên, hoàn toàn không chứa các thành phần hóa học, chất phụ gia. Sản phẩm là sự kết hợp hoàn hảo của sữa hòa quyện với mùi hương thơm mát của vani, đường, bơ béo hay những mảnh vụn của bánh Oreo… mang lại cho bạn sự thích thú, mới lạ ngay khi thưởng thức.
\nHương sôcôla tuyệt hảo với cảm giác mát lạnh, phù hợp để thưởng thức trong những ngày hè nóng bức hay những lúc mệt mỏi, stress trong cuộc sống hàng ngày.
\n\nThành phần: Nước, đường, siro gluco, vụn sôcôla, đạm Whey cô đặc, dầu dừa, bột cacao, bột sữa gầy, bột tách kem, hương vani tổng hợp, hương đắng tổng hợp, hương kem tổng hợp.
';

SET @BotMilo = 'Sữa lúa mạch Nestlé Milo Nguyên chất với chiết xuất Protomalt® từ mầm lúa mạch kết hợp với vitamin cùng khoáng chất thiết yếu giúp bé yêu phát triển thể chất toàn diện và đảm bảo năng lượng cho cả ngày dài năng động. Thức uống với hương vị thơm ngon, nguyên chất, là sự lựa chọn tuyệt vời của mẹ cho sự phát triển của bé.
\n\nThành phần: Protomalt® 32 % (chiết xuất từ mầm lúa mạch – extract from malted barley, tinh bột sắn), đường, sữa bột tách kem (skimmed milk powder), bột cacao, dầu thực vật, bột whey, các khoáng chất (dicalci phosphat, dinatri phosphat, sắt pyrophosphat), dầu bơ (từ sữa – from milk), sirô glucose, các vitamin (vitamin C, niacin, vitamin B6, B2, D, B12), muối i-ốt và hương vani tổng hợp.
';

SET @NhoMauDon = 'Nho mẫu đơn là giống nho mọng nước, quả có hình tròn đều, vị ngọt đậm đà và hương thơm nhẹ. Nho mẫu đơn tại Bách hóa XANH được đảm bảo nguồn gốc xuất xứ từ Trung Quốc và được đóng gói trong hộp nhựa sạch sẽ, đảm bảo vệ sinh.
\n\nGiá trị dinh dưỡng: Nho mẫu đơn chứa nhiều vitamin C, K, B6 và các khoáng chất như magne, sắt, kali. Đặc biệt, hàm lượng sắt dồi dào trong nho mẫu đơn rất tốt cho phụ nữ, trẻ em và những người bị thiếu máu. Bên cạnh đó, nho mẫu đơn cũng chứa nhiều chất chống oxy hóa, như nhóm thực vật polyphenol có lợi cho sức khỏe tim mạch và ngăn ngừa bệnh ung thư.
';

SET @SuaChuaVinamilk = 'Sữa chua của thương hiệu sữa chua Vinamilk chứa nhiều canxi, vitamin, khoáng chất ở dạng dễ hấp thu, kích thích vị giác, tăng cường sức khỏe hệ tiêu hóa. 2 lốc sữa chua Vinamilk nha đam hộp 100g là sự kết hợp giữa sữa chua sánh mịn với vị nha đam thơm ngon.
\n\nThành phần: Sữa, đường, nha đam, gelatin thực phẩm, chất ổn định, men Streptococcus thermophilus và Lactobacillus bulgaricus.
';

SET @SuaTuoiVinamilk = 'Sữa tươi tiệt trùng VNM có đường hộp 180ml được làm từ 100% sữa bò tươi nguyên chất giàu các dưỡng chất tự nhiên, tươi ngon & bổ dưỡng. Bổ sung Vitamin D3 theo chuẩn EFSA Châu Âu giúp hỗ trợ miễn dịch, cho cả gia đình thêm khỏe mạnh để luôn sẵn sàng làm tốt những công việc quan trọng mỗi ngày.
\n\nThành phần: chứa đạm, chất béo, canxi và các vitamin.
';

SET @SuaTamLifeBoy = 'Thiết kế cần gạt cho bạn lấy sữa tắm dễ dàng hơn.
\nCông thức ion bạc và bạc hà giúp bảo vệ khỏi vi khuẩn hơn gấp 10 lần
\nChứa các tinh thể bạc hà chiết xuất từ la bạc hà tươi, giúp làm sạch sâu các lỗ chân lông
';

SET @NemLui = 'Nem Lụi do Công ty VISSAN sản xuất và phân phối đảm bảo chất lượng tuyệt hảo, thơm ngon chuẩn vị miền trung với hương vị đặc trưng riêng mà không nơi nào có được. Sản phẩm thường được dùng kèm với bánh tráng, rau sống và nước chấm.
\n\nThành phần: Nạc heo, mỡ heo, đường, nước mắm, muối i-ốt (muối, kali iodat), tỏi, chất điều vị (621).
';

SET @TaoPinkLady = 'Táo nhập khẩu 100% từ New Zealand. Đạt tiêu chuẩn xuất khẩu toàn cầu. Bảo quản tươi ngon đến tận tay khách hàng. Trái vừa ăn, chắc tay, vỏ táo màu hồng xanh đẹp mắt.
';

SET @MiLauTomOmachi = 'Mì khoai tây lẩu tôm chua cay Omachi được đóng gói tiện dụng cho bạn sử dụng cũng như bảo quản. Vỏ đựng sản phẩm làm từ nguyên liệu sạch, không lẫn tạp chất hóa học độc hại. Sản phẩm do Csfood phân phối luôn mang đến chất lượng tốt nhất cho người tiêu dùng.
\n\nThành phần: Đường, muối, dầu thực vật, chất điều vị, gia vị (tỏi, ớt, tiêu, ngò thơm),...
';

SET @StrongbowAppleGold = 'STRONGBOW Vị Gold Apple là loại đồ uống có nguồn gốc châu Âu và được nhiều người trên thế giới ưa chuộng. Sản phẩm được chế biến bằng cách lên men hoa quả tự nhiên, tạo nên chất men thuần khiết và hương vị hài hòa.
\nSTRONGBOW Vị Gold Apple thích hợp tại các bữa tiệc tại gia, tiệc nướng, lẩu, liên hoa cuối tuần, họp mặt bạn bè... Sản phẩm chế biến dạng lon, tiện dụng việc sử dụng, bảo quản và di chuyển.
\n\nThành phần: Nước, nước táo lên men với sucrose (cider), si-rô, chất tạo khí carbonic (E290), chất điều chỉnh độ acid (E296), hương táo tự nhiên, màu caramel (E150a), chất bảo quản Kali Metabisulfit (E224).
';

SET @HaCaoMiniCauTre = 'Há cảo thực phẩm thơm ngon khó cưỡng, kết hợp với nhiều món ăn ngon, điển hình là há cảo Cầu Tre. Há cảo mini nhân thịt Cầu Tre 500g được chế biến từ các nguyên liệu chất lượng cao, gia vị đậm đà, kích thước mini gọn gàng và tiện lợi, dễ ăn.
\n\nThành phần: Da bột bánh, thịt heo, củ sắn, cá tra, tôm, bột, tinh bột bắp, đạm đậu nành, đuòng cát, cà rốt, bột hương thịt, chất điều vị,...
';

SET @BongTrangDiemSilcot = 'Bông trang điểm Silcot là sản phẩm chăm sóc da cao cấp bán chạy số 1 Nhật Bản trong hơn 10 năm liền. Được làm từ 100% sợi bông tự nhiên, bông trang điểm mềm xốp, êm ái và vô cùng dịu nhẹ với da. Sợi bông thấm được dàn đều cùng thiết kế dạng túi giúp miếng bông trang điểm không bị xù, biến dạng hoặc để lại xơ bông trên mặt đồng thời tiết kiệm dung dịch dưỡng da và tăng cường đối da hiệu quả trên da.
';


-- Configuration
INSERT INTO `saving_hour_market`.`configuration` (`id`, `limit_of_orders`, `number_of_suggested_pickup_point`, `system_status`)
--     VALUES (`id`, `limit_of_orders`, `number_of_suggested_pickup_point`, `system_status`);
    VALUES  (UUID_TO_BIN('accf78c1-5541-11ee-8a50-a85e45c41921'), 3, 3, @systemActive);


-- Customer
INSERT INTO `saving_hour_market`.`customer` (`id`, `status`, `date_of_birth`, `address`, `avatar_url`, `email`, `full_name`, `phone`, `gender`)
--     VALUES  ('id', 'status', '# date_of_birth', 'address', 'avatar_url', 'email', 'full_name', 'password', 'phone', 'username'),
    VALUES  (UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), @enable, '2002-05-05', '240 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, Thành phố Hồ Chí Minh', 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media', 'luugiavinh0@gmail.com', 'Luu Gia Vinh', '0902828618', @male),
            (UUID_TO_BIN('accef4cc-5541-11ee-8a50-a85e45c41921'), @enable, '2002-05-05', '50 Lê Văn Việt, Hiệp Phú, Quận 9, Thành phố Hồ Chí Minh', 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media', 'ladieuvan457@gmail.com', 'La Dieu Van', '0961780569', @female),
            (UUID_TO_BIN('accef619-5541-11ee-8a50-a85e45c41921'), @enable, '2002-05-05', '81 Nguyễn Xiển, Long Thạnh Mỹ, Quận 9, Thành phố Hồ Chí Minh', 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media', 'chuonghoaiviet555@gmail.com', 'Chuong Hoai Viet', '0904757264', @male),
            (UUID_TO_BIN('accef73d-5541-11ee-8a50-a85e45c41921'), @enable, '2002-05-05', '740 Nguyễn Xiển, Long Thạnh Mỹ, Quận 9, Thành phố Hồ Chí Minh', 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media', 'donganthu977@gmail.com', 'Dong An Thu', '0903829475', @female),
            (UUID_TO_BIN('accef866-5541-11ee-8a50-a85e45c41921'), @enable, '2002-05-05', '269 Đ. Liên Phường, Phước Long B, Quận 9, Thành phố Hồ Chí Minh', 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media', 'ngachongquang185@gmail.com', 'Ngac Hong Quang', '0904659243', @male),
            (UUID_TO_BIN('accef988-5541-11ee-8a50-a85e45c41921'), @enable, '2002-05-05', '441 Lê Văn Việt, Tăng Nhơn Phú A, Quận 9, Thành phố Hồ Chí Minh', 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media', 'ungthanhgiang458@gmail.com', 'Ung Thanh Giang', '0905628465', @female);


-- Staff
INSERT INTO `saving_hour_market`.`staff` (`id`, `email`, `full_name`, `role`, `avatar_url`, `status`)
--     VALUES (`id`, `email`, `full_name`, `role`, `avatar_url`, `status`);
    VALUES  (UUID_TO_BIN('accf4aa8-5541-11ee-8a50-a85e45c41921'), 'hieuntse161152@fpt.edu.vn', 'Trung Hieu', 'ADMIN', 'https://picsum.photos/200/300', @enable),
            (UUID_TO_BIN('accf4c03-5541-11ee-8a50-a85e45c41921'), 'vinhlgse161135@fpt.edu.vn', 'Gia Vinh', 'STAFF_SLT', 'https://picsum.photos/200/300', @enable),
            (UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), 'quangphse161539@fpt.edu.vn', 'Hong Quang', 'STAFF_ORD', 'https://picsum.photos/200/300', @enable),
            (UUID_TO_BIN('accf4e43-5541-11ee-8a50-a85e45c41921'), 'tuhase161714@fpt.edu.vn', 'Ha Tu', 'STAFF_MKT', 'https://picsum.photos/200/300', @enable),
            (UUID_TO_BIN('accf4f95-5541-11ee-8a50-a85e45c41921'), 'anhpnhse161740@fpt.edu.vn', 'Hung Anh', 'STAFF_DLV_1', 'https://picsum.photos/200/300', @enable),
            (UUID_TO_BIN('ec5e00f7-56dc-11ee-8a50-a85e45c41921'), 'nguoigiaohang1@fpt.com.vn', 'Nguyen Van A', 'STAFF_DLV_0', 'https://picsum.photos/200/300', @enable),
            (UUID_TO_BIN('ec5e0293-56dc-11ee-8a50-a85e45c41921'), 'nguoigiaohang2@fpt.com.vn', 'Nguyen Van B', 'STAFF_DLV_0', 'https://picsum.photos/200/300', @enable),
            (UUID_TO_BIN('ec5e0433-56dc-11ee-8a50-a85e45c41921'), 'nguoigiaohang3@fpt.com.vn', 'Nguyen Van C', 'STAFF_DLV_0', 'https://picsum.photos/200/300', @enable);





-- Product category
INSERT INTO `saving_hour_market`.`product_category` (`id`, `name`)
--     VALUES  ('id', 'name');
    VALUES  (UUID_TO_BIN('accefaab-5541-11ee-8a50-a85e45c41921'), 'Beverage'),
            (UUID_TO_BIN('accefbca-5541-11ee-8a50-a85e45c41921'), 'Food'),
            (UUID_TO_BIN('accefcee-5541-11ee-8a50-a85e45c41921'), 'Spice'),
            (UUID_TO_BIN('accefe0d-5541-11ee-8a50-a85e45c41921'), 'Personal Care'),
            (UUID_TO_BIN('acceff37-5541-11ee-8a50-a85e45c41921'), 'Pet Food'),
            (UUID_TO_BIN('accf0055-5541-11ee-8a50-a85e45c41921'), 'Cleaning Supply');


-- Product sub category
INSERT INTO `saving_hour_market`.`product_sub_category` (`id`, `name`, `allowable_display_threshold`, `product_category_id`)
--     VALUES ('id', 'name', 'allowable_display_threshold', 'product_category_id');
    VALUES  (UUID_TO_BIN('accf3fdf-5541-11ee-8a50-a85e45c41921'), 'Fruit', 3, UUID_TO_BIN('accefbca-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf40fe-5541-11ee-8a50-a85e45c41921'), 'Frozen Food Package', 4, UUID_TO_BIN('accefbca-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf4210-5541-11ee-8a50-a85e45c41921'), 'Frozen Dessert', 4, UUID_TO_BIN('accefbca-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf4320-5541-11ee-8a50-a85e45c41921'), 'Dairy Product', 2, UUID_TO_BIN('accefaab-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf4875-5541-11ee-8a50-a85e45c41921'), 'Noodles', 5, UUID_TO_BIN('accefbca-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf4766-5541-11ee-8a50-a85e45c41921'), 'Cosmetic', 30, UUID_TO_BIN('accefe0d-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf442f-5541-11ee-8a50-a85e45c41921'), 'Toiletries', 30, UUID_TO_BIN('accefe0d-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf4547-5541-11ee-8a50-a85e45c41921'), 'Detergents', 30, UUID_TO_BIN('accf0055-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf4656-5541-11ee-8a50-a85e45c41921'), 'Alcoholic drink', 5, UUID_TO_BIN('accefaab-5541-11ee-8a50-a85e45c41921'));

-- Supermarket
INSERT INTO `saving_hour_market`.`supermarket` (`id`, `status`, `address`, `name`, `phone`)
--     VALUES ('id', 'status', 'address', 'name', 'phone');
    VALUES  (UUID_TO_BIN('accf0172-5541-11ee-8a50-a85e45c41921'), @enable, '34 Đ. Nam Cao, Phường Tân Phú, Quận 9, Thành phố Hồ Chí Minh', 'Vinmart+', '0904756354'),
            (UUID_TO_BIN('accf03a7-5541-11ee-8a50-a85e45c41921'), @enable, '191 Quang Trung, Hiệp Phú, Quận 9, Thành phố Hồ Chí Minh', 'Co.opmart', '0904736452'),
            (UUID_TO_BIN('accf028b-5541-11ee-8a50-a85e45c41921'), @enable, '315 Đỗ Xuân Hợp, phường Phước Long B, quận 9', 'Satrafoods', '0904628495'),
            (UUID_TO_BIN('accf04c8-5541-11ee-8a50-a85e45c41921'), @enable, '46 Đ.61, Phước Long B, Quận 9, Thành phố Hồ Chí Minh', 'Bách hóa xanh', '0903636253'),
            (UUID_TO_BIN('accf0709-5541-11ee-8a50-a85e45c41921'), @enable, '344 Lê Văn Việt, Tăng Nhơn Phú B, Quận 9, Thành phố Hồ Chí Minh', 'Vissan', '0905736451');


-- Time frame
INSERT INTO `saving_hour_market`.`time_frame` (`id`, `day_of_week`, `from_hour`, `to_hour`, `status`)
--     VALUES ('id', 'day_of_week', 'from_hour', 'to_hour', 'status');
    VALUES  (UUID_TO_BIN('accf0876-5541-11ee-8a50-a85e45c41921'), 0, '19:00:00', '20:30:00', @enable),
            (UUID_TO_BIN('accf0996-5541-11ee-8a50-a85e45c41921'), 0, '21:00:00', '22:30:00', @enable);


-- Pickup point
INSERT INTO `saving_hour_market`.`pickup_point` (`id`, `address`, `latitude`, `longitude`, `status`)
--     VALUES ('id', 'address', 'latitude', 'longitude', 'status');
    VALUES  (UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921'), '662/2 Nguyễn Văn Tăng, Long Thạnh Mỹ, Quận 9, Thành phố Hồ Chí Minh', 10.844867, 106.831038, @enable),
            (UUID_TO_BIN('accf0be1-5541-11ee-8a50-a85e45c41921'), '63 Đ. Võ Nguyên Giáp, Thảo Điền, Quận 2, Thành phố Hồ Chí Minh', 10.801419, 106.736042, @enable),
            (UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921'), '432 Đ. Liên Phường, Phước Long B, Quận 9, Thành phố Hồ Chí Minh', 10.805475, 106.789022, @enable),
            (UUID_TO_BIN('accf0e1e-5541-11ee-8a50-a85e45c41921'), '857 Phạm Văn Đồng, P, Thủ Đức, Thành phố Hồ Chí Minh', 10.852884, 106.750717, @enable),
            (UUID_TO_BIN('accf0f40-5541-11ee-8a50-a85e45c41921'), '528 Huỳnh Tấn Phát, Tân Thuận Đông, Quận 7, Thành phố Hồ Chí Minh', 10.738769, 106.729944, @enable),
            (UUID_TO_BIN('accf105d-5541-11ee-8a50-a85e45c41921'), '159 Đ. Võ Nguyên Giáp, Thảo Điền, Quận 2, Thành phố Hồ Chí Minh', 10.803325, 106.741962, @enable),
            (UUID_TO_BIN('accf117b-5541-11ee-8a50-a85e45c41921'), '96 Đường số 4, Phước Bình, Quận 9, Thành phố Hồ Chí Minh', 10.818573, 106.771057, @enable);


-- Order Group
INSERT INTO `saving_hour_market`.`order_group` (`id`, `deliver_date`, `time_frame_id`, `pickup_point_id`, `deliverer_id`)
--     VALUES ('id', 'time_frame_id', 'pickup_point_id');
    VALUES  (UUID_TO_BIN('accf129e-5541-11ee-8a50-a85e45c41921'), '2023-09-18', UUID_TO_BIN('accf0876-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('accf13f0-5541-11ee-8a50-a85e45c41921'), '2023-09-18', UUID_TO_BIN('accf0876-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0be1-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('accf15b0-5541-11ee-8a50-a85e45c41921'), '2023-09-18', UUID_TO_BIN('accf0876-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('accf1749-5541-11ee-8a50-a85e45c41921'), '2023-09-18', UUID_TO_BIN('accf0876-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0e1e-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('accf187a-5541-11ee-8a50-a85e45c41921'), '2023-09-20', UUID_TO_BIN('accf0876-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0f40-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e00f7-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf19db-5541-11ee-8a50-a85e45c41921'), '2023-09-18', UUID_TO_BIN('accf0876-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf105d-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('accf1baa-5541-11ee-8a50-a85e45c41921'), '2023-09-19', UUID_TO_BIN('accf0876-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf117b-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e0433-56dc-11ee-8a50-a85e45c41921')),
--          second time frame
            (UUID_TO_BIN('accf1f39-5541-11ee-8a50-a85e45c41921'), '2023-09-17', UUID_TO_BIN('accf0996-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('accf20d1-5541-11ee-8a50-a85e45c41921'), '2023-09-17', UUID_TO_BIN('accf0996-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0be1-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('accf2205-5541-11ee-8a50-a85e45c41921'), '2023-09-17', UUID_TO_BIN('accf0996-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('accf2391-5541-11ee-8a50-a85e45c41921'), '2023-09-16', UUID_TO_BIN('accf0996-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0e1e-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e0433-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf26cb-5541-11ee-8a50-a85e45c41921'), '2023-09-17', UUID_TO_BIN('accf0996-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0f40-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('accf2846-5541-11ee-8a50-a85e45c41921'), '2023-09-17', UUID_TO_BIN('accf0996-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf105d-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('accf29d6-5541-11ee-8a50-a85e45c41921'), '2023-09-17', UUID_TO_BIN('accf0996-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf117b-5541-11ee-8a50-a85e45c41921'), null);


-- Order Batch
INSERT INTO `saving_hour_market`.`order_batch` (`id`, `district`, `deliver_date`, `deliverer_id`)
--     VALUES (`id`, `district`, `deliver_date`, `deliverer_id`);
    VALUES  (UUID_TO_BIN('ec5def3a-56dc-11ee-8a50-a85e45c41921'), '9', '2023-09-19', UUID_TO_BIN('ec5e0293-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5df0fa-56dc-11ee-8a50-a85e45c41921'), 'Bình Dương', '2023-09-19', null),
            (UUID_TO_BIN('ec5df219-56dc-11ee-8a50-a85e45c41921'), '2', '2023-09-19', null),
            (UUID_TO_BIN('ec5df327-56dc-11ee-8a50-a85e45c41921'), 'Đồng Nai', '2023-09-19', null),
            (UUID_TO_BIN('ec5df442-56dc-11ee-8a50-a85e45c41921'), 'Đồng Nai', '2023-09-20', null),
            (UUID_TO_BIN('ec5df557-56dc-11ee-8a50-a85e45c41921'), '2', '2023-09-20', null),
            (UUID_TO_BIN('ec5df668-56dc-11ee-8a50-a85e45c41921'), '9', '2023-09-20', null),
            (UUID_TO_BIN('ec5df810-56dc-11ee-8a50-a85e45c41921'), 'Bình Dương', '2023-09-21', null),
            (UUID_TO_BIN('ec5df929-56dc-11ee-8a50-a85e45c41921'), '1', '2023-09-21', null);



-- 'ec5dfa4a-56dc-11ee-8a50-a85e45c41921'
-- 'ec5dfb70-56dc-11ee-8a50-a85e45c41921'
-- 'ec5dfc7e-56dc-11ee-8a50-a85e45c41921'
-- 'ec5dfde4-56dc-11ee-8a50-a85e45c41921'
-- 'ec5dffb7-56dc-11ee-8a50-a85e45c41921'


-- Product
INSERT INTO `saving_hour_market`.`product` (`id`, `name`, `price`, `price_original`, `quantity`, `expired_date`, `description`, `image_url`, `status`, `product_sub_category_id`, `supermarket_id`)
--     VALUES (`id`, `name`, `price`, `price_original`, `quantity`, `expired_date`, `description`, `image_url`, `status`, `product_category_id`, `supermarket_id`);
    VALUES  (UUID_TO_BIN('accf2b04-5541-11ee-8a50-a85e45c41921'), 'Nước giặt Omo 2,9kg', 159000, 200000, 50, '2023-11-25 00:00:00', @OmoDescription, 'https://picsum.photos/500/500', @enable, UUID_TO_BIN('accf4547-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0172-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf2c1d-5541-11ee-8a50-a85e45c41921'), 'Chả Giò Tôm Cua 500g', 55000, 85000, 15, '2023-10-10 00:00:00', @ChaGioTomCuaDescription, 'https://picsum.photos/500/500', @enable, UUID_TO_BIN('accf40fe-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0709-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf2d37-5541-11ee-8a50-a85e45c41921'), 'Giò Heo Xông Khói 500g', 90000, 135000, 10, '2023-10-05 00:00:00', @GioHeoXongKhoi, 'https://picsum.photos/500/500', @enable, UUID_TO_BIN('accf40fe-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0709-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf2f65-5541-11ee-8a50-a85e45c41921'), 'Kem Wall’s Oreo hộp 750ml', 75000, 100000, 25, '2023-10-01 00:00:00', @KemWallOreo, 'https://picsum.photos/500/500', @enable, UUID_TO_BIN('accf4210-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf03a7-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf3079-5541-11ee-8a50-a85e45c41921'), 'Bột Milo Protomalt hũ 400g', 60000, 80000, 30, '2023-10-15 00:00:00', @BotMilo, 'https://picsum.photos/500/500', @enable, UUID_TO_BIN('accf4320-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf03a7-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf32f7-5541-11ee-8a50-a85e45c41921'), 'Nho mẫu đơn nội địa Trung 500g', 51000, 75000, 10, '2023-09-28 00:00:00', @NhoMauDon, 'https://picsum.photos/500/500', @enable, UUID_TO_BIN('accf3fdf-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf04c8-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf343c-5541-11ee-8a50-a85e45c41921'), '2 lốc sữa chua Vinamilk nha đam (8 hộp)', 42000, 60000, 10, '2023-09-30 00:00:00', @SuaChuaVinamilk, 'https://picsum.photos/500/500', @enable, UUID_TO_BIN('accf4320-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf04c8-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf3552-5541-11ee-8a50-a85e45c41921'), '1 lốc hộp sữa tươi Vinamilk có đường (4 hộp)', 25000, 33000, 15, '2023-10-03 00:00:00', @SuaTuoiVinamilk, 'https://picsum.photos/500/500', @enable, UUID_TO_BIN('accf4320-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0172-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf3664-5541-11ee-8a50-a85e45c41921'), 'Sữa tắm Lifebuoy Vitamin 800g', 145000, 180000, 10, '2023-11-20 00:00:00', @SuaTamLifeBoy, 'https://picsum.photos/500/500', @enable, UUID_TO_BIN('accf442f-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf03a7-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf377f-5541-11ee-8a50-a85e45c41921'), 'Nem Lụi 300g', 42000, 60000, 15, '2023-10-05 00:00:00', @NemLui, 'https://picsum.photos/500/500', @enable, UUID_TO_BIN('accf40fe-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0709-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf3897-5541-11ee-8a50-a85e45c41921'), 'Táo Pink Lady nhập khẩu New Zealand 1kg', 51000, 70000, 15, '2023-09-27 00:00:00', @TaoPinkLady, 'https://picsum.photos/500/500', @enable, UUID_TO_BIN('accf3fdf-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf04c8-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf39b0-5541-11ee-8a50-a85e45c41921'), 'Thùng 30 gói mì Omachi lẩu tôm', 185000, 245000, 10, '2023-10-20 00:00:00', @MiLauTomOmachi, 'https://picsum.photos/500/500', @enable, UUID_TO_BIN('accf4875-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf028b-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf3ac4-5541-11ee-8a50-a85e45c41921'), '1 lốc Strongbow Appple Ciders Gold (6 lon)', 88000, 110000, 20, '2023-10-15 00:00:00', @StrongbowAppleGold, 'https://picsum.photos/500/500', @enable, UUID_TO_BIN('accf4656-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf028b-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf3be3-5541-11ee-8a50-a85e45c41921'), 'Há Cảo Mini Cầu Tre Gói 500G', 58000, 80000, 15, '2023-10-02 00:00:00', @HaCaoMiniCauTre, 'https://picsum.photos/500/500', @enable, UUID_TO_BIN('accf40fe-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf028b-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf3cf4-5541-11ee-8a50-a85e45c41921'), 'Bông trang điểm Silcot hộp 82 miếng', 31000, 41000, 10, '2023-11-28 00:00:00', @BongTrangDiemSilcot, 'https://picsum.photos/500/500', @enable, UUID_TO_BIN('accf4766-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0172-5541-11ee-8a50-a85e45c41921'));


-- Discount
INSERT INTO `saving_hour_market`.`discount` (`id`, `name`, `percentage`, `quantity`, `spent_amount_required`, `expired_date`, `status`)
--     VALUES (`id`, `name`, `percentage`, `quantity`, `spent_amount_required`, `expired_date`, `status`);
    VALUES  (UUID_TO_BIN('accf51d6-5541-11ee-8a50-a85e45c41921'), 'Giảm giá, Ưu Đãi 20%', 20, 50, 150000, '2023-11-20 00:00:00', @enable),
            (UUID_TO_BIN('accf52f8-5541-11ee-8a50-a85e45c41921'), 'Giảm giá, Ưu Đãi 10%', 10, 40, 90000, '2023-11-20 00:00:00', @enable),
            (UUID_TO_BIN('accf5414-5541-11ee-8a50-a85e45c41921'), 'Siêu Ưu Đãi Khuyến mãi 35%', 35, 25, 300000, '2023-10-20 00:00:00', @enable),
            (UUID_TO_BIN('accf6fdd-5541-11ee-8a50-a85e45c41921'), 'Tuần lễ vàng - Ưu Đãi lớn 25%', 25, 35, 250000, '2023-10-02 00:00:00', @enable),
            (UUID_TO_BIN('accf7135-5541-11ee-8a50-a85e45c41921'), 'Ưu Đãi 5%', 5, 100, 60000, '2023-11-20 00:00:00', @enable),
            (UUID_TO_BIN('accf7525-5541-11ee-8a50-a85e45c41921'), 'Giảm giá bất ngờ - Ưu đãi 15%', 15, 25, 15000, '2023-10-15 00:00:00', @enable),
            (UUID_TO_BIN('accf7392-5541-11ee-8a50-a85e45c41921'), 'Ưu Đãi Tháng 10 - Giảm giá 20%', 20, 80, 200000, '2023-11-01 00:00:00', @enable),
            (UUID_TO_BIN('accf765b-5541-11ee-8a50-a85e45c41921'), 'Ưu Đãi Tháng 8 - Giảm giá 20%', 20, 80, 200000, '2023-09-01 00:00:00', @enable),
            (UUID_TO_BIN('accf77a1-5541-11ee-8a50-a85e45c41921'), 'Ưu Đãi Tháng 9 - Giảm giá 20%', 20, 0, 200000, '2023-10-01 00:00:00', @enable);


-- Discount_Product_Category
INSERT INTO `saving_hour_market`.`discount_product_category` (`discount_id`, `product_category_id`)
--     VALUES (`discount_id`, `product_category_id`)
    VALUES  (UUID_TO_BIN('accf51d6-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accefbca-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf51d6-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accefaab-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf6fdd-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accefbca-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf6fdd-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accefe0d-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf765b-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accefcee-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf7135-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0055-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf77a1-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accefaab-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf7525-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accefaab-5541-11ee-8a50-a85e45c41921'));


-- Discount_Product_Sub_Category
INSERT INTO `saving_hour_market`.`discount_product_sub_category` (`discount_id`, `product_sub_category_id`)
--     VALUES (`discount_id`, `product_sub_category_id`)
    VALUES  (UUID_TO_BIN('accf5414-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf442f-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf5414-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4766-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf5414-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf40fe-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf7392-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4210-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf7392-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf40fe-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf52f8-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4656-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf52f8-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4875-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf7525-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf3fdf-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf7525-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4547-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf7135-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf3fdf-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf7135-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4656-5541-11ee-8a50-a85e45c41921'));


-- Order - old (have deliverer id)
-- INSERT INTO `saving_hour_market`.`orders` (`id`, `total_price`, `created_time`, `address_deliver`, `qr_code_url`, `status`, `customer_id`, `packager_id`, `deliverer_id`, `discount_id`, `order_group_id`)
-- --     VALUES (`id`, `total_price`, `created_time`, `address_deliver`, `qr_code_url`, `status`, `customer_id`, `packager_id`, `deliverer_id`, `discount_id`, `order_group_id`);
--     VALUES  (UUID_TO_BIN('accf7b01-5541-11ee-8a50-a85e45c41921'), 352000, '2023-09-19 14:20:00', '240 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, Thành phố Hồ Chí Minh', 'qr code url here', @success,
--                 UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4f95-5541-11ee-8a50-a85e45c41921'), null, null),
--
--             (UUID_TO_BIN('accf7c79-5541-11ee-8a50-a85e45c41921'), 278400, '2023-09-16 15:00:00', '240 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, Thành phố Hồ Chí Minh', 'qr code url here', @success,
--                 UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4f95-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf51d6-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf2391-5541-11ee-8a50-a85e45c41921')),
--
--             (UUID_TO_BIN('accf7dc4-5541-11ee-8a50-a85e45c41921'), 546000, '2023-09-16 15:00:00', '240 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, Thành phố Hồ Chí Minh', 'qr code url here', @cancel,
--                 UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, null, null, UUID_TO_BIN('accf2391-5541-11ee-8a50-a85e45c41921')),
--
--             (UUID_TO_BIN('ec5dcac6-56dc-11ee-8a50-a85e45c41921'), 67000, '2023-09-19 13:00:00', '240 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, Thành phố Hồ Chí Minh', 'qr code url here', @processing,
--                 UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, null, null, UUID_TO_BIN('accf2391-5541-11ee-8a50-a85e45c41921')),
--
--             (UUID_TO_BIN('ec5de351-56dc-11ee-8a50-a85e45c41921'), 216000, '2023-09-20 08:00:00', '240 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, Thành phố Hồ Chí Minh', 'qr code url here', @packaging,
--                 UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), null, null, UUID_TO_BIN('accf2391-5541-11ee-8a50-a85e45c41921')),
--
--             (UUID_TO_BIN('ec5de6e9-56dc-11ee-8a50-a85e45c41921'), 111000, '2023-09-19 15:00:00', '240 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, Thành phố Hồ Chí Minh', 'qr code url here', @delivering,
--                 UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4f95-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('accf2391-5541-11ee-8a50-a85e45c41921')),
--
--             (UUID_TO_BIN('ec5debf5-56dc-11ee-8a50-a85e45c41921'), 304000, '2023-09-18 12:00:00', '240 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, Thành phố Hồ Chí Minh', 'qr code url here', @delivering,
--                 UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4f95-5541-11ee-8a50-a85e45c41921'), null, null);


-- Order new
INSERT INTO `saving_hour_market`.`orders` (`id`, `total_price`, `shipping_fee`, `created_time`, `delivery_date`, `payment_method`, `payment_status`, `address_deliver`, `qr_code_url`, `status`, `customer_id`, `packager_id`, `order_group_id`, `order_batch_id`)
--     VALUES (`id`, `total_price`, `shipping_fee`, `created_time`, `delivery_date`, `payment_method`, `address_deliver`, `qr_code_url`, `status`, `customer_id`, `packager_id`, `order_group_id`, `order_batch_id`);
    VALUES  (UUID_TO_BIN('accf7b01-5541-11ee-8a50-a85e45c41921'), 352000, 10000, '2023-09-17 14:20:00','2023-09-19 14:20:00', @cod, @paid, '240 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, Thành phố Hồ Chí Minh', 'qr code url here', @success,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('ec5def3a-56dc-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('accf7c79-5541-11ee-8a50-a85e45c41921'), 278400, 0, '2023-09-14 15:00:00', '2023-09-16 21:00:00', @vnpay, @paid, null, 'qr code url here', @success,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf2391-5541-11ee-8a50-a85e45c41921'), null),

            (UUID_TO_BIN('accf7dc4-5541-11ee-8a50-a85e45c41921'), 546000, 0, '2023-09-14 13:00:00', '2023-09-16 21:00:00', @cod, @unpaid, null, 'qr code url here', @cancel,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('accf2391-5541-11ee-8a50-a85e45c41921'), null),

            (UUID_TO_BIN('ec5dcac6-56dc-11ee-8a50-a85e45c41921'), 67000, 16000, '2023-09-18 13:00:00', '2023-09-19 13:00:00', @vnpay, @unpaid, '240 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, Thành phố Hồ Chí Minh', 'qr code url here', @processing,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, null, UUID_TO_BIN('ec5def3a-56dc-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('ec5de351-56dc-11ee-8a50-a85e45c41921'), 216000, 0, '2023-09-18 08:00:00', '2023-09-20 19:00:00', @vnpay, @paid, null, 'qr code url here', @packaging,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf187a-5541-11ee-8a50-a85e45c41921'), null),

            (UUID_TO_BIN('ec5de6e9-56dc-11ee-8a50-a85e45c41921'), 111000, 0, '2023-09-17 15:00:00', '2023-09-19 19:00:00', @cod, @unpaid, null, 'qr code url here', @delivering,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf1baa-5541-11ee-8a50-a85e45c41921'), null),

            (UUID_TO_BIN('ec5debf5-56dc-11ee-8a50-a85e45c41921'), 304000, 19000, '2023-09-16 12:00:00', '2023-09-19 12:00:00', @cod, @unpaid, '240 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, Thành phố Hồ Chí Minh', 'qr code url here', @delivering,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('ec5def3a-56dc-11ee-8a50-a85e45c41921'));


-- Order discount
INSERT INTO `saving_hour_market`.`discount_order` (`discount_id`, `order_id`)
    VALUES  (UUID_TO_BIN('accf51d6-5541-11ee-8a50-a85e45c41921'),UUID_TO_BIN('accf7b01-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf6fdd-5541-11ee-8a50-a85e45c41921'),UUID_TO_BIN('accf7b01-5541-11ee-8a50-a85e45c41921')),

--             (UUID_TO_BIN('accf6fdd-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf7c79-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf51d6-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf7c79-5541-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('accf77a1-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dcac6-56dc-11ee-8a50-a85e45c41921'));
--             (UUID_TO_BIN('accf52f8-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dcac6-56dc-11ee-8a50-a85e45c41921'));



-- Order Detail
INSERT INTO `saving_hour_market`.`order_detail` (`id`, `product_id`, `bought_quantity`, `product_price`, `product_original_price`, `order_id`)
--     VALUES (`id`, `product_id`, `bought_quantity`, `product_original_price`, `product_price`, `order_id`);
    VALUES  (UUID_TO_BIN('accf7ee5-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf2d37-5541-11ee-8a50-a85e45c41921'), 1, 90000, 135000, UUID_TO_BIN('accf7b01-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf8026-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf2f65-5541-11ee-8a50-a85e45c41921'), 1, 75000, 100000, UUID_TO_BIN('accf7b01-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf814e-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf377f-5541-11ee-8a50-a85e45c41921'), 1, 42000, 60000, UUID_TO_BIN('accf7b01-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf8271-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf3664-5541-11ee-8a50-a85e45c41921'), 1, 145000, 180000, UUID_TO_BIN('accf7b01-5541-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('accf8390-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf2c1d-5541-11ee-8a50-a85e45c41921'), 2, 55000, 85000, UUID_TO_BIN('accf7c79-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf84af-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf3be3-5541-11ee-8a50-a85e45c41921'), 1, 58000, 80000, UUID_TO_BIN('accf7c79-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf864a-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf2d37-5541-11ee-8a50-a85e45c41921'), 2, 90000, 135000, UUID_TO_BIN('accf7c79-5541-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('accf8775-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf3ac4-5541-11ee-8a50-a85e45c41921'), 2, 88000, 110000, UUID_TO_BIN('accf7dc4-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf88e1-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf39b0-5541-11ee-8a50-a85e45c41921'), 2, 185000, 245000, UUID_TO_BIN('accf7dc4-5541-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('ec5ddff7-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf343c-5541-11ee-8a50-a85e45c41921'), 1, 42000, 60000, UUID_TO_BIN('ec5dcac6-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5de21a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf3552-5541-11ee-8a50-a85e45c41921'), 1, 25000, 33000, UUID_TO_BIN('ec5dcac6-56dc-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('ec5de48d-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf39b0-5541-11ee-8a50-a85e45c41921'), 1, 185000, 245000, UUID_TO_BIN('ec5de351-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5de5be-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf3cf4-5541-11ee-8a50-a85e45c41921'), 1, 31000, 41000, UUID_TO_BIN('ec5de351-56dc-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('ec5de94e-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf3079-5541-11ee-8a50-a85e45c41921'), 1, 60000, 80000, UUID_TO_BIN('ec5de6e9-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5dea86-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf3897-5541-11ee-8a50-a85e45c41921'), 1, 51000, 70000, UUID_TO_BIN('ec5de6e9-56dc-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('ec5ded18-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf2b04-5541-11ee-8a50-a85e45c41921'), 1, 159000, 200000, UUID_TO_BIN('ec5debf5-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5dee28-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf3664-5541-11ee-8a50-a85e45c41921'), 1, 145000, 180000, UUID_TO_BIN('ec5debf5-56dc-11ee-8a50-a85e45c41921'));

-- UUID gen


-- 'ec5e05ac-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e070b-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e0855-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e099f-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e1c52-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e1ddc-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e1f3a-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e2090-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e321c-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e33d6-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e3596-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e3778-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e38e3-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e3a42-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e3b8f-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e3ced-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e3e40-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e4012-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e41d8-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e432f-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e44d1-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e4627-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e4897-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e49f8-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e4b66-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e4cbe-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e4e60-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e4fce-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e574e-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e5994-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e5e8d-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e6233-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e65cb-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e68fd-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e6c43-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e6db5-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e6f17-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e713f-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e744a-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e77a5-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e7bef-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e7e0c-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e8083-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e8385-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e84dd-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e869e-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e87ec-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e894d-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e8b2b-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e8c78-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e8dca-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e8f16-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e9073-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e923c-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e9414-56dc-11ee-8a50-a85e45c41921'
-- 'ec5ea1b4-56dc-11ee-8a50-a85e45c41921'
-- 'ec5ea361-56dc-11ee-8a50-a85e45c41921'
-- 'ec5ea50d-56dc-11ee-8a50-a85e45c41921'
-- 'ec5ea6b7-56dc-11ee-8a50-a85e45c41921'
-- 'ec5ea831-56dc-11ee-8a50-a85e45c41921'
-- 'ec5ea9a5-56dc-11ee-8a50-a85e45c41921'
-- 'ec5eab5f-56dc-11ee-8a50-a85e45c41921'
-- 'ec5eacbb-56dc-11ee-8a50-a85e45c41921'
-- 'ec5eae10-56dc-11ee-8a50-a85e45c41921'
-- 'ec5eaf69-56dc-11ee-8a50-a85e45c41921'
-- 'ec5eb268-56dc-11ee-8a50-a85e45c41921'
-- 'ec5eb3ce-56dc-11ee-8a50-a85e45c41921'
-- 'ec5eb531-56dc-11ee-8a50-a85e45c41921'
-- 'ec5eb87e-56dc-11ee-8a50-a85e45c41921'
-- 'ec5ebcb3-56dc-11ee-8a50-a85e45c41921'
-- 'ec5ec37a-56dc-11ee-8a50-a85e45c41921'

