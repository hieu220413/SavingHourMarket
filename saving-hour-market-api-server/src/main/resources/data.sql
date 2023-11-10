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

-- Delivery method: Pickup point(0), Door-to-Door (1)
SET @PickupPoint = 0;
SET @DoorToDoor = 1;
SET @All = 2;

-- Payment status: unpaid(0), paid(1)
SET @unpaid = 0;
SET @paid = 1;

-- Clone order date
SET @Today = '2023-10-06';
SET @Tomorrow = '2023-10-07';
SET @TwoNextDay = '2023-10-08';
SET @ThreeNextDay = '2023-10-09';

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

SET @XaLachLolo = 'Xà lách lolo xanh thủy canh chứa hàm lượng lớn các khoáng chất canxi, sắt, magie, phốt pho, natri, kẽm, và đặc biệt hàm lượng kali và canxi cao hơn so với các loại xà lách là màu xanh. Hàm lượng vitamin A cao hơn so với 1 số loại rau cải ăn lá, và chứa một số vitamin cần thiết khác như vitamin C, B6, folate, E, thiamin, riboflavin, niacin.
\n\nXà lách lolo xanh thủy canh có thể sử dụng để làm nhiều món ăn nhưng thích hợp nhất là món salad, các món cuộn, hay ăn kèm các loại nước sốt, canh chua,.. Hương vị của rau sẽ ngon hơn khi dùng với dầu olive, muối, giấm hoặc sốt mayonaise. Người dùng có thể thêm các nguyên liệu như củ đậu, cà chua, đậu phộng, phomai sợi,… để tăng hương vị món ăn.
';

SET @CaiThao = 'Bắp cải thảo là loại rau có bẹ lá to, giòn, ngọt thường được dùng để nấu canh, xào chung với rau củ hoặc để muối kim chi.
\n\nCải thảo cũng giống với các loại rau khác, có thể sử dụng phổ biến trong bữa ăn hàng ngày, có thể kể đến một số món ăn chế biến từ cải thảo như: canh cải thảo, cải thảo cuốn thịt, cải thảo xào,... Ngoài ra, khi nhắc đến cải thảo thì bạn sẽ nhớ ngay đến món ăn đặc sản của Hàn Quốc đó chính là kim chi, cay cay, chua chua kích thích vị giác vô cùng.
';

SET @NuocXaComfort = 'Những bộ cánh yêu thích nhanh chóng bạc màu, sờn vải sau mỗi lần giặt khiến bạn đau đầu tìm giải pháp? Đừng lo, vì đã có chuyên gia chăm sóc áo quần Comfort! Nước Xả Vải Comfort Chăm Sóc Chuyên Sâu mới sẽ giúp bạn ngăn bạc màu và ngừa sờn vải. Với công thức Ultra Care độc quyền, nước xả vải Comfort thẩm thấu sâu vào từng sợi vải tạo nên lớp màng giúp bảo vệ màu sắc và độ bền sợi vải, cũng như lưu lại hương thơm lôi cuốn bền lâu, giữ áo quần luôn như mới sau nhiều lần giặt.
';

SET @PhoMaiVienHoaDanh = 'Phô Mai Que Hoa Doanh Phô mai que với lớp vỏ vàng giòn rụm và phần phô mai béo ngậy hương thơm tự nhiên hấp dẫn.
\n\nPhô mai que đã trở thành món ăn thông dụng, được dùng như món tráng miệng trong các nhà hàng, các quán trà sữa hay những quán ăn vặt...Sản phẩm phù hợp với mọi lứa tuổi từ trẻ em đến người lớn do hương thơm tự nhiên, cực kỳ lôi cuốn.
';

SET @sapVaseline = 'Sáp Vaseline sẽ giúp bảo vệ da khỏi những tác động của thời tiết và nó hoạt động như chất hàn gắn cho các tế bào của da và ngăn cản sự mất nước của làn da.Giúp cho các tế bào da sẽ tự củng cố và tái tạo từ bên trong,chống khô da ,trị nứt nẻ ,giúp hàn gắn lại những vết cắt nhỏ và những vết bỏng.
'
;

SET @BiaHeineken = 'Heineken là loại bia có hương vị đậm đà, khó quên và luôn bỏ xa các đối thủ cạnh tranh trong các cuộc thử nghiệm về chất lượng giữa các lọai bia. Trong số những người tham gia blind testing trong năm 2003, 90% cho biết họ sẽ chọn lại Bia Heineken (Hà Lan).
\nHeineken được tạo ra bởi một nhóm người tận tâm theo đuổi chất lượng cao nhất, bảo tồn theo công thức phát minh ra ba thế hệ trước bởi gia đình Heineken. Hương vị của nó hơi chua chua, ngọt, hương thơm nhẹ, màu sắc tươi sáng và rõ nét, đặc biệt được làm từ nước tinh khiết, hoa bia và mạch nha lúa mạch, Heineken không chứa các chất phụ gia.
';

SET @MiHaoHaoKimChi = 'Hương vị mới Lẩu Kim Chi Hàn Quốc còn sở hữu vị nước súp ngon chua chua cay cay thơm lừng mùi kim chi, đặc biệt phù hợp với khẩu vị của người Việt Nam. Cùng với tính tiện lợi sẵn có, Hảo Hảo tin chắc rằng bạn có thể thưởng thức hương vị mới này ở bất kì khi nào và bạn sẽ có thêm thật nhiều hạnh phúc khi nhớ đến những ký ức tốt đẹp và động lực để phát triến trong tương lai.
\n\nThành phần: Bột mì, dầu cọ, tinh bột khoai mì, muối, đường, nước mắm, chất điều vị (621), chất ổn định (451(i), 501(i)), chất điều chỉnh độ acid (500(i)), phẩm màu curcumin tự nhiên, bột nghệ, chất chống oxy hóa (320, 321). Muối, dầu cọ, chất điều vị (621, 631, 627, 951), đường, các gia vị (tỏi, ớt, gừng, tiêu), chất điều chỉnh độ acid (330, 296), hương liệu (hương kim chi tự nhiên, hương bò tổng hợp), chiết xuất nấm men, chất chống đông vón (551), hành lá sấy, phẩm màu paprika oleoresin tự nhiên.
';

SET @SuaTamXmenDetox = 'Sữa tắm Detox dành cho nam giới đầu tiên tại Việt Nam với Than tre hoạt tính giúp loại bỏ 5 tác nhân ô nhiễm, làm sạch sâu, loại bỏ hiệu quả dầu nhờn và bụi bẩn trên cơ thể.
\n\nThành phần: Water, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Perfume, Cocamide MEA, Sodium Chloride, Potassium Cocoyl Glycinate, Sodium Lauroyl Sarcosinate, Menthol, Hydroxyethylcellulose, Mentha Arvensis Leaf Oil, Mentha Piperita (Peppermint) Oil, Citric Acid, Tetrasodium EDTA, Benzophenone-4, BHT, Sodium Cumenesulfonate, Styrene/ Acrylates Copolymer, Methylchloroisothiazolinone, Methylisothiazolinone, CI 60730, CI 42051.
';

SET @KemYukimiMatcha = 'Đậm đà hương vị Nhật Bản với kem Mochi Yukimi Daifuku của Lotte.
\nMochi Lotte là bánh mochi nhân kem matcha ăn vị khá lạ và đặc trưng hương vị Nhật Bản, ngọt vừa, vị beo béo vỏ mềm dẻo, mịn thơm.
\n\nThành phần: Đường, siro bắp, bột gạo, dairy product (bột sữa tách béo 10%, bơ), dầu thực vật, siro bắp fructose, tinh bột bắp, bột lòng trắng trứng, chất ổn định (dextrin), muối, chất nhũ hóa (este của acid béo với propylene glycol; este của polyglycerol với acid béo), chất ổn định (gôm gua; gôm đậu carob/gôm đậu locust; carrageenan), tinh bột biến tính (oxidized starch), hương tổng hợp (hương matcha, hương sữa), màu thực phẩm tự nhiên (chất chiết xuất từ annatto, norbixin-based; chất chiết xuất từ gardenia yellow).
';

SET @NemBoTieuXanh = 'Sản phẩm Nem Bò tiêu xanh được chế biến từ nguồn nguyên liệu thịt nạc bò tươi, sạch đạt chuẩn ESCAS và được giết mổ trực tiếp tại nhà máy của Công ty. Do đó, thịt khi đưa vào sản xuất vẫn đảm bảo được độ kết dính và dai giòn cho món ăn. Với hương vị thơm ngon từ thịt bò tươi nguyên chất cùng những thớ thịt dai giòn sực sực kết hợp độc đáo cùng tiêu xanh thơm lừng và vị nồng nàn của xả làm cho món Nem bò tiêu xanh trở nên vô cùng hấp dẫn.
\nThêm vào đó là tính tiện dụng của sản phẩm sẽ giúp người dùng dễ dàng chế biến và tiết kiệm thời gian khi nấu nướng. Chỉ cần 10 - 15 phút chiên hoặc nướng sản phẩm bằng nồi chiên không dầu hoặc chảo là có ngay những chiếc nem bò tiêu xanh thơm ngon lạ vị để thưởng thức cùng bạn bè và gia đình.
';

-- Configuration
-- INSERT INTO `saving_hour_market`.`configuration` (`id`, `limit_of_orders`, `number_of_suggested_pickup_point`, `extra_shipping_fee_per_kilometer`, `initial_shipping_fee`, `min_km_distance_for_extra_shipping_fee`, `delete_unpaid_order_time`, `system_status`)
-- --     VALUES (`id`, `limit_of_orders`, `number_of_suggested_pickup_point`, `delete_unpaid_order_time`, `system_status`);
--     VALUES  (UUID_TO_BIN('accf78c1-5541-11ee-8a50-a85e45c41921'), 3, 3, 1000, 10000, 2, 1, @systemActive);


-- Customer
INSERT INTO `saving_hour_market`.`customer` (`id`, `status`, `date_of_birth`, `address`, `avatar_url`, `email`, `full_name`, `phone`, `gender`)
--     VALUES  ('id', 'status', '# date_of_birth', 'address', 'avatar_url', 'email', 'full_name', 'password', 'phone', 'username'),
    VALUES  (UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), @enable, '2002-05-05', '240 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, Thành phố Hồ Chí Minh', 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media', 'luugiavinh0@gmail.com', 'Luu Gia Vinh', '0902828618', @male),
            (UUID_TO_BIN('accef4cc-5541-11ee-8a50-a85e45c41921'), @enable, '2002-05-05', '50 Lê Văn Việt, Hiệp Phú, Quận 9, Thành phố Hồ Chí Minh', 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media', 'ladieuvan457@gmail.com', 'La Dieu Van', '0961780569', @female),
            (UUID_TO_BIN('accef619-5541-11ee-8a50-a85e45c41921'), @enable, '2002-05-05', '81 Nguyễn Xiển, Long Thạnh Mỹ, Quận 9, Thành phố Hồ Chí Minh', 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media', 'chuonghoaiviet555@gmail.com', 'Chuong Hoai Viet', '0904757264', @male),
            (UUID_TO_BIN('accef73d-5541-11ee-8a50-a85e45c41921'), @enable, '2002-05-05', '740 Nguyễn Xiển, Long Thạnh Mỹ, Quận 9, Thành phố Hồ Chí Minh', 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media', 'donganthu977@gmail.com', 'Dong An Thu', '0903829475', @female),
            (UUID_TO_BIN('accef866-5541-11ee-8a50-a85e45c41921'), @enable, '2002-05-05', '269 Đ. Liên Phường, Phước Long B, Quận 9, Thành phố Hồ Chí Minh', 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media', 'ngachongquang185@gmail.com', 'Ngac Hong Quang', '0904659243', @male),
            (UUID_TO_BIN('accef988-5541-11ee-8a50-a85e45c41921'), @enable, '2002-05-05', '441 Lê Văn Việt, Tăng Nhơn Phú A, Quận 9, Thành phố Hồ Chí Minh', 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media', 'ungthanhgiang458@gmail.com', 'Ung Thanh Giang', '0905628465', @female);


-- Product Consolidation Area
INSERT INTO `saving_hour_market`.`product_consolidation_area` (`id`, `address`, `latitude`, `longitude`, `status`)
VALUES  (UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), 'Đường N7, Tăng Nhơn Phú A, Thủ Đức, Hồ Chí Minh', 10.846756594531838, 106.80459035612381, @enable),
        (UUID_TO_BIN('ec5dfde4-56dc-11ee-8a50-a85e45c41921'), '9 Nam Hòa, Phước Long A, Thủ Đức, Hồ Chí Minh', 10.821593957000061, 106.76009552300007, @enable);
--             (UUID_TO_BIN('ec5dfb70-56dc-11ee-8a50-a85e45c41921'), ),
--             (UUID_TO_BIN('ec5dfc7e-56dc-11ee-8a50-a85e45c41921'), );


-- Pickup point
INSERT INTO `saving_hour_market`.`pickup_point` (`id`, `address`, `latitude`, `longitude`, `status`)
--     VALUES ('id', 'address', 'latitude', 'longitude', 'status');
    VALUES  (UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921'), 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', 10.845020092805793, 106.83102962168277, @enable),
        --       chua co trong supermarket address
        --         (UUID_TO_BIN('accf0be1-5541-11ee-8a50-a85e45c41921'), '20 Đ. Nguyễn Đăng Giai, Thảo Điền, Quận 2, Hồ Chí Minh', 10.8019121, 106.7362979, @enable),
        (UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921'), '432 Đ. Liên Phường, Phước Long B, Quận 9, Hồ Chí Minh', 10.8059505, 106.7891284, @enable),
        (UUID_TO_BIN('accf0e1e-5541-11ee-8a50-a85e45c41921'), '857 Phạm Văn Đồng, Linh Tây, Thủ Đức, Hồ Chí Minh', 10.85273099400007, 106.75072682500007, @enable),
        --       chua co trong supermarket address
        --         (UUID_TO_BIN('accf0f40-5541-11ee-8a50-a85e45c41921'), '430 Huỳnh Tấn Phát, Bình Thuận, Quận 7, Hồ Chí Minh', 10.7457942, 106.7290568, @enable),
        (UUID_TO_BIN('accf105d-5541-11ee-8a50-a85e45c41921'), '77C Trần Ngọc Diện, Thảo Điền, Thủ Đức, Hồ Chí Minh', 10.80274197700004, 106.73845902300008, @enable);
--             (UUID_TO_BIN('accf117b-5541-11ee-8a50-a85e45c41921'), '96 Đường Số 4, Phước Bình, Thủ Đức, Hồ Chí Minh', 10.818471742000042, 106.77107158600006, @enable, UUID_TO_BIN('ec5dfde4-56dc-11ee-8a50-a85e45c41921'));


-- Pickup_point_Product_Consolidation_Area
INSERT INTO `saving_hour_market`.`pickup_point_product_consolidation_area` (`pickup_point_id`, `product_consolidation_area_id`)
--      VALUES (`pickup_point_id`, `product_consolidation_area_id`)
    VALUES  (UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfde4-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf0e1e-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfde4-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf105d-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfde4-56dc-11ee-8a50-a85e45c41921'));



-- Staff
INSERT INTO `saving_hour_market`.`staff` (`id`, `email`, `full_name`, `role`, `avatar_url`, `status`)
--     VALUES (`id`, `email`, `full_name`, `role`, `avatar_url`, `status`);
    VALUES  (UUID_TO_BIN('accf4aa8-5541-11ee-8a50-a85e45c41921'), 'hieuntse161152@fpt.edu.vn', 'Trung Hieu', 'ADMIN', 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media', @enable),
            (UUID_TO_BIN('accf4c03-5541-11ee-8a50-a85e45c41921'), 'vinhlgse161135@fpt.edu.vn', 'Gia Vinh', 'STAFF_SLT', 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media', @enable),
            (UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), 'quangphse161539@fpt.edu.vn', 'Hong Quang', 'STAFF_ORD', 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media', @enable),
            (UUID_TO_BIN('accf4e43-5541-11ee-8a50-a85e45c41921'), 'tuhase161714@fpt.edu.vn', 'Ha Tu', 'STAFF_MKT', 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media', @enable),
            (UUID_TO_BIN('accf4f95-5541-11ee-8a50-a85e45c41921'), 'anhpnhse161740@fpt.edu.vn', 'Hung Anh', 'STAFF_DLV_1', 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media', @enable),
            (UUID_TO_BIN('ec5e00f7-56dc-11ee-8a50-a85e45c41921'), 'nguoigiaohang1@fpt.com.vn', 'Nguyen Van A', 'STAFF_DLV_0', 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media', @enable),
            (UUID_TO_BIN('ec5e0293-56dc-11ee-8a50-a85e45c41921'), 'nguoigiaohang2@fpt.com.vn', 'Nguyen Van B', 'STAFF_DLV_0', 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media', @enable),
            (UUID_TO_BIN('ec5e0433-56dc-11ee-8a50-a85e45c41921'), 'nguoigiaohang3@fpt.com.vn', 'Nguyen Van C', 'STAFF_DLV_0', 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdefault-avatar.jpg?alt=media', @enable);



-- Staff_Pickup_Point
INSERT INTO `saving_hour_market`.`staff_pickup_point` (`staff_id`, `pickup_point_id`)
--    VALUES (`id`, `email`, `full_name`, `role`, `avatar_url`, `status`);
    VALUES  (UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921'));



-- 'ec5dffb7-56dc-11ee-8a50-a85e45c41921'




-- Product category
INSERT INTO `saving_hour_market`.`product_category` (`id`, `name`)
--     VALUES  ('id', 'name');
    VALUES  (UUID_TO_BIN('accefaab-5541-11ee-8a50-a85e45c41921'), 'Đồ uống'),
            (UUID_TO_BIN('accefbca-5541-11ee-8a50-a85e45c41921'), 'Thực phẩm'),
            (UUID_TO_BIN('accefcee-5541-11ee-8a50-a85e45c41921'), 'Gia vị'),
            (UUID_TO_BIN('accefe0d-5541-11ee-8a50-a85e45c41921'), 'Chăm sóc cá nhân'),
            (UUID_TO_BIN('acceff37-5541-11ee-8a50-a85e45c41921'), 'Thức ăn cho thú cưng'),
            (UUID_TO_BIN('accf0055-5541-11ee-8a50-a85e45c41921'), 'Vật tư vệ sinh');


-- Product sub category
INSERT INTO `saving_hour_market`.`product_sub_category` (`id`, `name`, `allowable_display_threshold`, `product_category_id`, `image_url`)
--     VALUES ('id', 'name', 'allowable_display_threshold', 'product_category_id');
    VALUES  (UUID_TO_BIN('accf3fdf-5541-11ee-8a50-a85e45c41921'), 'Trái cây', 3, UUID_TO_BIN('accefbca-5541-11ee-8a50-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Ffruit.png?alt=media'),
            (UUID_TO_BIN('ec5e1ddc-56dc-11ee-8a50-a85e45c41921'), 'Rau củ', 2, UUID_TO_BIN('accefbca-5541-11ee-8a50-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fvegetable.png?alt=media'),
            (UUID_TO_BIN('accf40fe-5541-11ee-8a50-a85e45c41921'), 'Thực phẩm đông lạnh gói', 4, UUID_TO_BIN('accefbca-5541-11ee-8a50-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Ffrozen-food.png?alt=media'),
            (UUID_TO_BIN('accf4210-5541-11ee-8a50-a85e45c41921'), 'Đồ tráng miệng lạnh', 4, UUID_TO_BIN('accefbca-5541-11ee-8a50-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Ffrozen-desert.png?alt=media'),
            (UUID_TO_BIN('accf4320-5541-11ee-8a50-a85e45c41921'), 'Sữa', 2, UUID_TO_BIN('accefaab-5541-11ee-8a50-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdiary-product.png?alt=media'),
            (UUID_TO_BIN('accf4875-5541-11ee-8a50-a85e45c41921'), 'Mì', 5, UUID_TO_BIN('accefbca-5541-11ee-8a50-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fnoodles.png?alt=media'),
            (UUID_TO_BIN('accf4766-5541-11ee-8a50-a85e45c41921'), 'Mỹ phẩm', 30, UUID_TO_BIN('accefe0d-5541-11ee-8a50-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fcosmetics.png?alt=media'),
            (UUID_TO_BIN('accf442f-5541-11ee-8a50-a85e45c41921'), 'Đồ dùng vệ sinh cá nhân', 30, UUID_TO_BIN('accefe0d-5541-11ee-8a50-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Ftoiletries.png?alt=media'),
            (UUID_TO_BIN('accf4547-5541-11ee-8a50-a85e45c41921'), 'Chất tẩy rửa', 30, UUID_TO_BIN('accf0055-5541-11ee-8a50-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fdetergent.png?alt=media'),
            (UUID_TO_BIN('accf4656-5541-11ee-8a50-a85e45c41921'), 'Đồ uống có cồn', 5, UUID_TO_BIN('accefaab-5541-11ee-8a50-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Falcoholic-drink.png?alt=media');


-- Supermarket
INSERT INTO `saving_hour_market`.`supermarket` (`id`, `status`, `name`, `phone`)
--     VALUES ('id', 'status', 'address', 'name', 'phone');
    VALUES  (UUID_TO_BIN('accf0172-5541-11ee-8a50-a85e45c41921'), @enable, 'Vinmart+', '0904756354'),
            (UUID_TO_BIN('accf03a7-5541-11ee-8a50-a85e45c41921'), @enable, 'Co.opmart', '0904736452'),
            (UUID_TO_BIN('accf028b-5541-11ee-8a50-a85e45c41921'), @enable, 'Satrafoods', '0904628495'),
            (UUID_TO_BIN('accf04c8-5541-11ee-8a50-a85e45c41921'), @enable, 'Bách hóa xanh', '0903636253'),
            (UUID_TO_BIN('accf0709-5541-11ee-8a50-a85e45c41921'), @enable, 'Vissan', '0905736451');


-- Supermarket Address
INSERT INTO `saving_hour_market`.`supermarket_address` (`id`, `address`, `supermarket_id`, `pickup_point_id`)
    VALUES  (UUID_TO_BIN('ec5e8c78-56dc-11ee-8a50-a85e45c41921'), '34 Đ. Nam Cao, Phường Tân Phú, Quận 9, Hồ Chí Minh', UUID_TO_BIN('accf0172-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e2090-56dc-11ee-8a50-a85e45c41921'), '48 Cầu Xây,Tân Phú,Thủ Đức,Hồ Chí Minh', UUID_TO_BIN('accf0172-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e8dca-56dc-11ee-8a50-a85e45c41921'), '191 Quang Trung, Hiệp Phú, Thủ Đức, Hồ Chí Minh', UUID_TO_BIN('accf03a7-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0e1e-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e1f3a-56dc-11ee-8a50-a85e45c41921'), '82 Ngô Quyền,Hiệp Phú,Quận 9,Hồ Chí Minh', UUID_TO_BIN('accf03a7-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0e1e-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e8f16-56dc-11ee-8a50-a85e45c41921'), '172 Nguyễn Xiển,Trường Thạnh,Thủ Đức,Hồ Chí Minh', UUID_TO_BIN('accf028b-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e9073-56dc-11ee-8a50-a85e45c41921'), '25 Cầu Xây,Tân Phú,Thủ Đức,Hồ Chí Minh', UUID_TO_BIN('accf04c8-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e9414-56dc-11ee-8a50-a85e45c41921'), '344 Lê Văn Việt, Tăng Nhơn Phú B, Thủ Đức, Hồ Chí Minh', UUID_TO_BIN('accf0709-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0e1e-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5ea1b4-56dc-11ee-8a50-a85e45c41921'), '89/1A Bưng Ông Thoàn, Phú Hữu, Thủ Đức, Hồ Chí Minh', UUID_TO_BIN('accf0172-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5ea361-56dc-11ee-8a50-a85e45c41921'), '8 Nguyễn Hoàng, An Phú, Thủ Đức, Hồ Chí Minh', UUID_TO_BIN('accf04c8-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf105d-5541-11ee-8a50-a85e45c41921'));




-- 'ec5e321c-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e33d6-56dc-11ee-8a50-a85e45c41921'


-- Time frame
INSERT INTO `saving_hour_market`.`time_frame` (`id`, `from_hour`, `to_hour`, `status`, `allowable_deliver_method`)
--     VALUES ('id', 'day_of_week', 'from_hour', 'to_hour', 'status');
    VALUES  (UUID_TO_BIN('accf0876-5541-11ee-8a50-a85e45c41921'), '19:00:00', '20:30:00', @enable, @PickupPoint),
            (UUID_TO_BIN('accf0996-5541-11ee-8a50-a85e45c41921'), '21:00:00', '22:30:00', @enable, @PickupPoint),
            (UUID_TO_BIN('ec5e05ac-56dc-11ee-8a50-a85e45c41921'), '08:00:00', '09:30:00', @enable, @DoorToDoor),
            (UUID_TO_BIN('ec5e070b-56dc-11ee-8a50-a85e45c41921'), '10:00:00', '11:30:00', @enable, @DoorToDoor),
            (UUID_TO_BIN('ec5e0855-56dc-11ee-8a50-a85e45c41921'), '12:00:00', '13:30:00', @enable, @DoorToDoor),
            (UUID_TO_BIN('ec5e099f-56dc-11ee-8a50-a85e45c41921'), '14:00:00', '15:30:00', @enable, @DoorToDoor),
            (UUID_TO_BIN('ec5e1c52-56dc-11ee-8a50-a85e45c41921'), '16:00:00', '17:30:00', @enable, @DoorToDoor);






-- Order Group
INSERT INTO `saving_hour_market`.`order_group` (`id`, `deliver_date`, `time_frame_id`, `pickup_point_id`, `deliverer_id`, `product_consolidation_area_id`)
--     VALUES ('id', 'time_frame_id', 'pickup_point_id');
    VALUES  (UUID_TO_BIN('accf129e-5541-11ee-8a50-a85e45c41921'), '2023-09-19', UUID_TO_BIN('accf0876-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921'), null, null),
--             (UUID_TO_BIN('accf13f0-5541-11ee-8a50-a85e45c41921'), '2023-09-18', UUID_TO_BIN('accf0876-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0be1-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('accf15b0-5541-11ee-8a50-a85e45c41921'), '2023-09-19', UUID_TO_BIN('accf0876-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921'), null, null),
            (UUID_TO_BIN('accf1749-5541-11ee-8a50-a85e45c41921'), '2023-09-19', UUID_TO_BIN('accf0876-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0e1e-5541-11ee-8a50-a85e45c41921'), null, null),
--             (UUID_TO_BIN('accf187a-5541-11ee-8a50-a85e45c41921'), '2023-09-20', UUID_TO_BIN('accf0876-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0f40-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e00f7-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf19db-5541-11ee-8a50-a85e45c41921'), '2023-09-19', UUID_TO_BIN('accf0876-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf105d-5541-11ee-8a50-a85e45c41921'), null, null),
            (UUID_TO_BIN('accf1baa-5541-11ee-8a50-a85e45c41921'), '2023-09-20', UUID_TO_BIN('accf0876-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf105d-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e0433-56dc-11ee-8a50-a85e45c41921'), null),
--          second time frame
            (UUID_TO_BIN('accf1f39-5541-11ee-8a50-a85e45c41921'), '2023-09-18', UUID_TO_BIN('accf0996-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921'), null, null),
--             (UUID_TO_BIN('accf20d1-5541-11ee-8a50-a85e45c41921'), '2023-09-17', UUID_TO_BIN('accf0996-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0be1-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('accf2205-5541-11ee-8a50-a85e45c41921'), '2023-09-18', UUID_TO_BIN('accf0996-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921'), null, null),
            (UUID_TO_BIN('accf2391-5541-11ee-8a50-a85e45c41921'), '2023-09-17', UUID_TO_BIN('accf0996-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0e1e-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e0433-56dc-11ee-8a50-a85e45c41921'),null),
--             (UUID_TO_BIN('accf26cb-5541-11ee-8a50-a85e45c41921'), '2023-09-17', UUID_TO_BIN('accf0996-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0f40-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('accf2846-5541-11ee-8a50-a85e45c41921'), '2023-09-18', UUID_TO_BIN('accf0996-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf105d-5541-11ee-8a50-a85e45c41921'), null, null),
--             (UUID_TO_BIN('accf29d6-5541-11ee-8a50-a85e45c41921'), '2023-09-17', UUID_TO_BIN('accf0996-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf117b-5541-11ee-8a50-a85e45c41921'), null);
-- dummy order group
            (UUID_TO_BIN('a4e3cae1-78cf-11ee-a832-a85e45c41921'), '2023-11-20', UUID_TO_BIN('ec5e05ac-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921'), null, null),
            (UUID_TO_BIN('a4e3cc1d-78cf-11ee-a832-a85e45c41921'), '2023-11-20', UUID_TO_BIN('ec5e099f-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921'), null, null),
            (UUID_TO_BIN('a4e3cdbb-78cf-11ee-a832-a85e45c41921'), '2023-11-20', UUID_TO_BIN('ec5e070b-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3d067-78cf-11ee-a832-a85e45c41921'), '2023-11-20', UUID_TO_BIN('ec5e099f-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921'), null, null),
            (UUID_TO_BIN('a4e3d18e-78cf-11ee-a832-a85e45c41921'), '2023-11-20', UUID_TO_BIN('ec5e0855-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'));



-- Order Batch
INSERT INTO `saving_hour_market`.`order_batch` (`id`, `deliver_date`, `deliverer_id`)
--     VALUES (`id`, `district`, `deliver_date`, `deliverer_id`);
    VALUES  (UUID_TO_BIN('ec5def3a-56dc-11ee-8a50-a85e45c41921'), '2023-09-19', UUID_TO_BIN('ec5e0293-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5df0fa-56dc-11ee-8a50-a85e45c41921'), '2023-09-19', null),
            (UUID_TO_BIN('ec5df219-56dc-11ee-8a50-a85e45c41921'), '2023-09-19', null),
            (UUID_TO_BIN('ec5df327-56dc-11ee-8a50-a85e45c41921'), '2023-09-19', null),
            (UUID_TO_BIN('ec5df442-56dc-11ee-8a50-a85e45c41921'), '2023-09-20', null),
            (UUID_TO_BIN('ec5df557-56dc-11ee-8a50-a85e45c41921'), '2023-09-20', null),
            (UUID_TO_BIN('ec5df668-56dc-11ee-8a50-a85e45c41921'), '2023-09-20', null),
            (UUID_TO_BIN('ec5df810-56dc-11ee-8a50-a85e45c41921'), '2023-09-21', null),
            (UUID_TO_BIN('ec5df929-56dc-11ee-8a50-a85e45c41921'), '2023-09-21', null);


-- Product
INSERT INTO `saving_hour_market`.`product` (`id`, `name`, `unit`, `description`, `status`, `product_sub_category_id`, `supermarket_id`)
--     VALUES (`id`, `name`, `price`, `price_original`, `quantity`, `expired_date`, `description`, `image_url`, `status`, `product_category_id`, `supermarket_id`);
    VALUES  (UUID_TO_BIN('accf2b04-5541-11ee-8a50-a85e45c41921'), 'Nước giặt Omo 2,9L', 'túi', @OmoDescription, @enable, UUID_TO_BIN('accf4547-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0172-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e38e3-56dc-11ee-8a50-a85e45c41921'), 'Nước xả vải Comfort hương nước hoa 3,8L', 'túi', @NuocXaComfort, @enable, UUID_TO_BIN('accf4547-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0172-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf2c1d-5541-11ee-8a50-a85e45c41921'), 'Chả Giò Tôm Cua 500g', 'bịch', @ChaGioTomCuaDescription, @enable, UUID_TO_BIN('accf40fe-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0709-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf2d37-5541-11ee-8a50-a85e45c41921'), 'Giò Heo Xông Khói 500g', 'bịch', @GioHeoXongKhoi, @enable, UUID_TO_BIN('accf40fe-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0709-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf2f65-5541-11ee-8a50-a85e45c41921'), 'Kem Wall’s Oreo hộp 750ml', 'hộp', @KemWallOreo, @enable, UUID_TO_BIN('accf4210-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf03a7-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e3b8f-56dc-11ee-8a50-a85e45c41921'), 'Kem Yukimi Daifuku Matcha 270ml', 'hộp', @KemYukimiMatcha, @enable, UUID_TO_BIN('accf4210-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf03a7-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf3079-5541-11ee-8a50-a85e45c41921'), 'Bột Milo Protomalt hũ 400g', 'hũ', @BotMilo, @enable, UUID_TO_BIN('accf4320-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf03a7-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf32f7-5541-11ee-8a50-a85e45c41921'), 'Nho mẫu đơn nội địa Trung 500g', '500g', @NhoMauDon, @enable, UUID_TO_BIN('accf3fdf-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf04c8-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf343c-5541-11ee-8a50-a85e45c41921'), '1 lốc sữa chua Vinamilk nha đam (4 hộp)', 'lốc', @SuaChuaVinamilk, @enable, UUID_TO_BIN('accf4320-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf04c8-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf3552-5541-11ee-8a50-a85e45c41921'), '1 lốc hộp sữa tươi Vinamilk có đường (4 hộp)', 'lốc', @SuaTuoiVinamilk, @enable, UUID_TO_BIN('accf4320-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0172-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf3664-5541-11ee-8a50-a85e45c41921'), 'Sữa tắm Lifebuoy Vitamin 800g', 'chai', @SuaTamLifeBoy, @enable, UUID_TO_BIN('accf442f-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf03a7-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e3ced-56dc-11ee-8a50-a85e45c41921'), 'Sữa tắm Xmen sạch khuẩn detox 630g', 'chai', @SuaTamXmenDetox, @enable, UUID_TO_BIN('accf442f-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0172-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf377f-5541-11ee-8a50-a85e45c41921'), 'Nem Lụi 300g', 'bịch', @NemLui, @enable, UUID_TO_BIN('accf40fe-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0709-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e432f-56dc-11ee-8a50-a85e45c41921'), 'Nem bò tiêu xanh 400g', 'bịch', @NemBoTieuXanh, @enable, UUID_TO_BIN('accf40fe-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0709-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e3a42-56dc-11ee-8a50-a85e45c41921'), 'Phô mai viên Hoa Doanh 300g', 'bịch', @PhoMaiVienHoaDanh, @enable, UUID_TO_BIN('accf40fe-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf03a7-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf3897-5541-11ee-8a50-a85e45c41921'), 'Táo Pink Lady nhập khẩu New Zealand 1kg', '1kg', @TaoPinkLady, @enable, UUID_TO_BIN('accf3fdf-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf04c8-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf39b0-5541-11ee-8a50-a85e45c41921'), 'Thùng 30 gói mì Omachi lẩu tôm', 'thùng', @MiLauTomOmachi, @enable, UUID_TO_BIN('accf4875-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf028b-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e3e40-56dc-11ee-8a50-a85e45c41921'), 'Thùng 30 gói mì Hảo Hảo hương vị lẩu kim chi', 'thùng', @MiHaoHaoKimChi, @enable, UUID_TO_BIN('accf4875-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf04c8-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf3ac4-5541-11ee-8a50-a85e45c41921'), '1 lốc Strongbow Appple Ciders Gold (6 lon)', 'lốc', @StrongbowAppleGold, @enable, UUID_TO_BIN('accf4656-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf028b-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e4012-56dc-11ee-8a50-a85e45c41921'), 'Thùng 24 lon bia Heineken Silver', 'thùng', @BiaHeineken, @enable, UUID_TO_BIN('accf4656-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf04c8-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf3be3-5541-11ee-8a50-a85e45c41921'), 'Há Cảo Mini Cầu Tre Gói 500G', 'bịch', @HaCaoMiniCauTre, @enable, UUID_TO_BIN('accf40fe-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf028b-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf3cf4-5541-11ee-8a50-a85e45c41921'), 'Bông trang điểm Silcot hộp 82 miếng', 'hộp', @BongTrangDiemSilcot, @enable, UUID_TO_BIN('accf4766-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0172-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e41d8-56dc-11ee-8a50-a85e45c41921'), 'Sáp dưỡng ẩm Vaseline 50ml', 'hũ', @sapVaseline, @enable, UUID_TO_BIN('accf4766-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf03a7-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e3596-56dc-11ee-8a50-a85e45c41921'), 'Xà lách lolo 1kg', '1kg', @XaLachLolo, @enable, UUID_TO_BIN('ec5e1ddc-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0172-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e3778-56dc-11ee-8a50-a85e45c41921'), 'Cải thảo 1kg', '1kg', @CaiThao, @enable, UUID_TO_BIN('ec5e1ddc-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0172-5541-11ee-8a50-a85e45c41921'));


-- Product image
INSERT INTO `saving_hour_market`.`product_image` (`id`, `image_url`, `product_id`)
--      VALUES (`id`, `image_url`, `product_id`)
--  Nước giặt Omo 2,9L
    VALUES  (UUID_TO_BIN('a4e38eb7-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fnuoc-giat-omo.jpeg?alt=media', UUID_TO_BIN('accf2b04-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3b8cb-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fnuoc-giat-omo-2.jpg?alt=media', UUID_TO_BIN('accf2b04-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3b9fa-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fnuoc-giat-omo-3.jpg?alt=media', UUID_TO_BIN('accf2b04-5541-11ee-8a50-a85e45c41921')),
--  Nước xả vải Comfort hương nước hoa 3,8L batch
            (UUID_TO_BIN('a4e38c04-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fnuoc-xa-vai-comfort.jpg?alt=media', UUID_TO_BIN('ec5e38e3-56dc-11ee-8a50-a85e45c41921')),
--  Chả Giò Tôm Cua 500g
            (UUID_TO_BIN('a4e38d2e-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fcha-gio-tom-cua-500g.jpg?alt=media', UUID_TO_BIN('accf2c1d-5541-11ee-8a50-a85e45c41921')),
--  Giò Heo Xông Khói 500g
            (UUID_TO_BIN('a4e38fdd-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fgio_heo_xong_khoi.jpg?alt=media', UUID_TO_BIN('accf2d37-5541-11ee-8a50-a85e45c41921')),
--  Kem Wall’s Oreo hộp 750ml
            (UUID_TO_BIN('a4e3914b-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fkem-walls-oreo-hop.jpg?alt=media', UUID_TO_BIN('accf2f65-5541-11ee-8a50-a85e45c41921')),
--  Kem Yukimi Daifuku Matcha 270ml
            (UUID_TO_BIN('a4e39274-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fkem-yukimi-daifuku-matcha.jpg?alt=media', UUID_TO_BIN('ec5e3b8f-56dc-11ee-8a50-a85e45c41921')),
--  Bột Milo Protomalt hũ 400g
            (UUID_TO_BIN('a4e39395-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fbot-milo-protomalt.jpg?alt=media', UUID_TO_BIN('accf3079-5541-11ee-8a50-a85e45c41921')),
--  Nho mẫu đơn nội địa Trung 500g
            (UUID_TO_BIN('a4e394b7-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fnho_mau_don.jpg?alt=media', UUID_TO_BIN('accf32f7-5541-11ee-8a50-a85e45c41921')),
--  2 lốc sữa chua Vinamilk nha đam (8 hộp)
            (UUID_TO_BIN('a4e3976d-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fsua-chua-vinamilk-nha-dam.jpg?alt=media', UUID_TO_BIN('accf343c-5541-11ee-8a50-a85e45c41921')),
-- 1 lốc hộp sữa tươi Vinamilk có đường (4 hộp)
            (UUID_TO_BIN('a4e398a4-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fsua-tuoi-vinamilk-co-duong.jpg?alt=media', UUID_TO_BIN('accf3552-5541-11ee-8a50-a85e45c41921')),
-- Sữa tắm Lifebuoy Vitamin 800g
            (UUID_TO_BIN('a4e399c7-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fsua-tam-lifeboy.jpg?alt=media', UUID_TO_BIN('accf3664-5541-11ee-8a50-a85e45c41921')),
-- Sữa tắm Xmen sạch khuẩn detox 630g
            (UUID_TO_BIN('a4e39aed-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fsua-tam-xmen-sach-khuan-detox.jpg?alt=media', UUID_TO_BIN('ec5e3ced-56dc-11ee-8a50-a85e45c41921')),
-- Nem Lụi 300g
            (UUID_TO_BIN('a4e39c16-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fnem-lui.jpg?alt=media', UUID_TO_BIN('accf377f-5541-11ee-8a50-a85e45c41921')),
-- Nem bò tiêu xanh 400g
            (UUID_TO_BIN('a4e39f05-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fnem-bo-tieu-xanh.jpg?alt=media', UUID_TO_BIN('ec5e432f-56dc-11ee-8a50-a85e45c41921')),
-- Phô mai viên Hoa Doanh 300g
            (UUID_TO_BIN('a4e39da8-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fpho-mai-vien-hoa-doanh.jpg?alt=media', UUID_TO_BIN('ec5e3a42-56dc-11ee-8a50-a85e45c41921')),
-- Táo Pink Lady nhập khẩu New Zealand 1kg
            (UUID_TO_BIN('a4e3a032-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Ftao-pinklady.jpg?alt=media', UUID_TO_BIN('accf3897-5541-11ee-8a50-a85e45c41921')),
-- Thùng 30 gói mì Omachi lẩu tôm
            (UUID_TO_BIN('a4e3a15a-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fthung-mi-omachi-lau-tom.jpg?alt=media', UUID_TO_BIN('accf39b0-5541-11ee-8a50-a85e45c41921')),
-- Thùng 30 gói mì Hảo Hảo hương vị lẩu kim chi
            (UUID_TO_BIN('a4e3a285-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fthung-mi-hao-hao-kim-chi.jpg?alt=media', UUID_TO_BIN('ec5e3e40-56dc-11ee-8a50-a85e45c41921')),
-- 1 lốc Strongbow Appple Ciders Gold (6 lon)
            (UUID_TO_BIN('a4e3a3b1-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fstrongbow-apple-cider.jpg?alt=media', UUID_TO_BIN('accf3ac4-5541-11ee-8a50-a85e45c41921')),
-- Thùng 24 lon bia Heineken Silver
            (UUID_TO_BIN('a4e3a4ec-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fthung-bia-heineken.jpg?alt=media', UUID_TO_BIN('ec5e4012-56dc-11ee-8a50-a85e45c41921')),
-- Há Cảo Mini Cầu Tre Gói 500G
            (UUID_TO_BIN('a4e3a611-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fha-cao-mini.jpg?alt=media', UUID_TO_BIN('accf3be3-5541-11ee-8a50-a85e45c41921')),
-- Bông trang điểm Silcot hộp 82 miếng
            (UUID_TO_BIN('a4e3a78d-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fbong-tay-trang-silicot.jpg?alt=media', UUID_TO_BIN('accf3cf4-5541-11ee-8a50-a85e45c41921')),
-- Sáp dưỡng ẩm Vaseline 50ml
            (UUID_TO_BIN('a4e3a8bb-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fsap-duong-am-vaseline.jpg?alt=media', UUID_TO_BIN('ec5e41d8-56dc-11ee-8a50-a85e45c41921')),
-- Xà lách lolo 1kg
            (UUID_TO_BIN('a4e3aa45-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fxa-lach-lolo.jpg?alt=media', UUID_TO_BIN('ec5e3596-56dc-11ee-8a50-a85e45c41921')),
-- Cải thảo 1kg
            (UUID_TO_BIN('a4e3b720-78cf-11ee-a832-a85e45c41921'), 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fcai-thao.jpg?alt=media', UUID_TO_BIN('ec5e3778-56dc-11ee-8a50-a85e45c41921'));




INSERT INTO `saving_hour_market`.`product_batch` (`id`, `price`, `price_original`, `quantity`, `selling_date`, `expired_date`, `product_id`,`supermarket_address_id`)
--     VALUES (`id`, `price`, `price_original`, `quantity`, `expired_date`, `product_id`,`supermarket_address_id`)
--  Nước giặt Omo 2,9L
    VALUES  (UUID_TO_BIN('ec5ea50d-56dc-11ee-8a50-a85e45c41921'), 159000, 130000, 50, '2023-11-04 00:00:00', '2023-12-25 00:00:00', UUID_TO_BIN('accf2b04-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e8c78-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5eb3ce-56dc-11ee-8a50-a85e45c41921'), 159000, 130000, 25, '2023-11-04 00:00:00', '2023-12-25 00:00:00', UUID_TO_BIN('accf2b04-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e2090-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5eb531-56dc-11ee-8a50-a85e45c41921'), 149000, 120000, 25, '2023-11-04 00:00:00', '2023-12-20 00:00:00', UUID_TO_BIN('accf2b04-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e2090-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5eb87e-56dc-11ee-8a50-a85e45c41921'), 159000, 130000, 20, '2023-11-04 00:00:00', '2023-12-25 00:00:00', UUID_TO_BIN('accf2b04-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5ea1b4-56dc-11ee-8a50-a85e45c41921')),
--  Nước xả vải Comfort hương nước hoa 3,8L batch
            (UUID_TO_BIN('ec5ea6b7-56dc-11ee-8a50-a85e45c41921'), 210000, 180000, 25, '2023-10-25 00:00:00', '2023-11-30 00:00:00', UUID_TO_BIN('ec5e38e3-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5ea1b4-56dc-11ee-8a50-a85e45c41921')),
--  Chả Giò Tôm Cua 500g
            (UUID_TO_BIN('ec5ea831-56dc-11ee-8a50-a85e45c41921'), 55000, 48000, 15, '2023-10-15 00:00:00', '2023-11-10 00:00:00', UUID_TO_BIN('accf2c1d-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e9414-56dc-11ee-8a50-a85e45c41921')),
--  Giò Heo Xông Khói 500g
            (UUID_TO_BIN('ec5ea9a5-56dc-11ee-8a50-a85e45c41921'), 90000, 75000, 10, '2023-10-10 00:00:00', '2023-11-05 00:00:00', UUID_TO_BIN('accf2d37-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e9414-56dc-11ee-8a50-a85e45c41921')),
--  Kem Wall’s Oreo hộp 750ml
            (UUID_TO_BIN('ec5eab5f-56dc-11ee-8a50-a85e45c41921'), 75000, 62000, 25, '2023-10-20 00:00:00', '2023-11-15 00:00:00', UUID_TO_BIN('accf2f65-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e8dca-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5ebcb3-56dc-11ee-8a50-a85e45c41921'), 80000, 68000, 25, '2023-11-01 00:00:00', '2023-11-30 00:00:00', UUID_TO_BIN('accf2f65-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e8dca-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5ec37a-56dc-11ee-8a50-a85e45c41921'), 75000, 62000, 25, '2023-10-24 00:00:00', '2023-11-15 00:00:00', UUID_TO_BIN('accf2f65-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e1f3a-56dc-11ee-8a50-a85e45c41921')),
--  Kem Yukimi Daifuku Matcha 270ml
            (UUID_TO_BIN('ec5eacbb-56dc-11ee-8a50-a85e45c41921'), 60000, 50000, 30, '2023-10-10 00:00:00', '2023-11-10 00:00:00', UUID_TO_BIN('ec5e3b8f-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e8dca-56dc-11ee-8a50-a85e45c41921')),
--  Bột Milo Protomalt hũ 400g
            (UUID_TO_BIN('ec5eae10-56dc-11ee-8a50-a85e45c41921'), 60000, 49000, 30, '2023-10-10 00:00:00', '2023-11-15 00:00:00', UUID_TO_BIN('accf3079-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e8dca-56dc-11ee-8a50-a85e45c41921')),
--  Nho mẫu đơn nội địa Trung 500g
            (UUID_TO_BIN('ec5e869e-56dc-11ee-8a50-a85e45c41921'), 51000, 40000, 10, '2023-10-01 00:00:00', '2023-10-28 00:00:00', UUID_TO_BIN('accf32f7-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5ea361-56dc-11ee-8a50-a85e45c41921')),
--  2 lốc sữa chua Vinamilk nha đam (8 hộp)
            (UUID_TO_BIN('ec5eaf69-56dc-11ee-8a50-a85e45c41921'), 42000, 35000, 10, '2023-10-05 00:00:00', '2023-10-30 00:00:00', UUID_TO_BIN('accf343c-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e9073-56dc-11ee-8a50-a85e45c41921')),
-- 1 lốc hộp sữa tươi Vinamilk có đường (4 hộp)
            (UUID_TO_BIN('ec5eb268-56dc-11ee-8a50-a85e45c41921'), 25000, 21000, 15, '2023-10-01 00:00:00', '2023-10-29 00:00:00', UUID_TO_BIN('accf3552-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5ea1b4-56dc-11ee-8a50-a85e45c41921')),
-- Sữa tắm Lifebuoy Vitamin 800g
            (UUID_TO_BIN('ec5e44d1-56dc-11ee-8a50-a85e45c41921'), 145000, 120000, 10, '2023-11-05 00:00:00', '2023-12-20 00:00:00', UUID_TO_BIN('accf3664-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e8dca-56dc-11ee-8a50-a85e45c41921')),
-- Sữa tắm Xmen sạch khuẩn detox 630g
            (UUID_TO_BIN('ec5e4627-56dc-11ee-8a50-a85e45c41921'), 155000, 130000, 25, '2023-11-10 00:00:00', '2023-12-20 00:00:00', UUID_TO_BIN('ec5e3ced-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e8c78-56dc-11ee-8a50-a85e45c41921')),
-- Nem Lụi 300g
            (UUID_TO_BIN('ec5e4897-56dc-11ee-8a50-a85e45c41921'), 42000, 35000, 15, '2023-10-10 00:00:00', '2023-11-05 00:00:00', UUID_TO_BIN('accf377f-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e9414-56dc-11ee-8a50-a85e45c41921')),
-- Nem bò tiêu xanh 400g
            (UUID_TO_BIN('ec5e49f8-56dc-11ee-8a50-a85e45c41921'), 65000, 55000, 15, '2023-10-25 00:00:00', '2023-11-26 00:00:00', UUID_TO_BIN('ec5e432f-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e9414-56dc-11ee-8a50-a85e45c41921')),
-- Phô mai viên Hoa Doanh 300g
            (UUID_TO_BIN('ec5e4b66-56dc-11ee-8a50-a85e45c41921'), 42000, 34000, 20, '2023-10-05 00:00:00', '2023-11-05 00:00:00', UUID_TO_BIN('ec5e3a42-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e9414-56dc-11ee-8a50-a85e45c41921')),
-- Táo Pink Lady nhập khẩu New Zealand 1kg
            (UUID_TO_BIN('ec5e4cbe-56dc-11ee-8a50-a85e45c41921'), 51000, 42000, 15, '2023-10-01 00:00:00', '2023-10-27 00:00:00', UUID_TO_BIN('accf3897-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e9073-56dc-11ee-8a50-a85e45c41921')),
-- Thùng 30 gói mì Omachi lẩu tôm
            (UUID_TO_BIN('ec5e4e60-56dc-11ee-8a50-a85e45c41921'), 185000, 155000, 10, '2023-10-19 00:00:00', '2023-11-25 00:00:00', UUID_TO_BIN('accf39b0-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e8f16-56dc-11ee-8a50-a85e45c41921')),
-- Thùng 30 gói mì Hảo Hảo hương vị lẩu kim chi
            (UUID_TO_BIN('ec5e4fce-56dc-11ee-8a50-a85e45c41921'), 95000, 80000, 25, '2023-11-01 00:00:00', '2023-11-29 00:00:00', UUID_TO_BIN('ec5e3e40-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5ea361-56dc-11ee-8a50-a85e45c41921')),
-- 1 lốc Strongbow Appple Ciders Gold (6 lon)
            (UUID_TO_BIN('ec5e744a-56dc-11ee-8a50-a85e45c41921'), 88000, 75000, 20, '2023-10-20 00:00:00', '2023-11-15 00:00:00', UUID_TO_BIN('accf3ac4-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e8f16-56dc-11ee-8a50-a85e45c41921')),
-- Thùng 24 lon bia Heineken Silver
            (UUID_TO_BIN('ec5e77a5-56dc-11ee-8a50-a85e45c41921'), 340000, 300000, 10, '2023-11-01 00:00:00', '2023-11-30 00:00:00', UUID_TO_BIN('ec5e4012-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e9073-56dc-11ee-8a50-a85e45c41921')),
-- Há Cảo Mini Cầu Tre Gói 500G
            (UUID_TO_BIN('ec5e7bef-56dc-11ee-8a50-a85e45c41921'), 58000, 49000, 15, '2023-10-01 00:00:00', '2023-11-02 00:00:00', UUID_TO_BIN('accf3be3-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e8f16-56dc-11ee-8a50-a85e45c41921')),
-- Bông trang điểm Silcot hộp 82 miếng
            (UUID_TO_BIN('ec5e7e0c-56dc-11ee-8a50-a85e45c41921'), 31000, 27000, 10, '2023-11-25 00:00:00', '2023-12-28 00:00:00', UUID_TO_BIN('accf3cf4-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e8c78-56dc-11ee-8a50-a85e45c41921')),
-- Sáp dưỡng ẩm Vaseline 50ml
            (UUID_TO_BIN('ec5e8083-56dc-11ee-8a50-a85e45c41921'), 50000, 42000, 25, '2023-11-26 00:00:00', '2023-12-26 00:00:00', UUID_TO_BIN('ec5e41d8-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e8dca-56dc-11ee-8a50-a85e45c41921')),
-- Xà lách lolo 1kg
            (UUID_TO_BIN('ec5e8385-56dc-11ee-8a50-a85e45c41921'), 40000, 34000, 15, '2023-10-20 00:00:00', '2023-11-25 00:00:00', UUID_TO_BIN('ec5e3596-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e8c78-56dc-11ee-8a50-a85e45c41921')),
-- Cải thảo 1kg
            (UUID_TO_BIN('ec5e84dd-56dc-11ee-8a50-a85e45c41921'), 18000, 16000, 10, '2023-10-25 00:00:00', '2023-11-26 00:00:00', UUID_TO_BIN('ec5e3778-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5ea1b4-56dc-11ee-8a50-a85e45c41921'));








-- 'ec5e87ec-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e894d-56dc-11ee-8a50-a85e45c41921'
-- 'ec5e8b2b-56dc-11ee-8a50-a85e45c41921'



-- Discount
INSERT INTO `saving_hour_market`.`discount` (`id`, `name`, `percentage`, `quantity`, `spent_amount_required`, `expired_date`, `status`, `image_url`, `product_category_id`, `product_sub_category_id`)
--     VALUES (`id`, `name`, `percentage`, `quantity`, `spent_amount_required`, `expired_date`, `status`);
    VALUES  (UUID_TO_BIN('accf51d6-5541-11ee-8a50-a85e45c41921'), 'Giảm giá, Ưu Đãi 20%', 20, 50, 150000, '2023-11-20 00:00:00', @enable, 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fspecial-diascount-banner.png?alt=media', UUID_TO_BIN('accefbca-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('ec5e5994-56dc-11ee-8a50-a85e45c41921'), 'Giảm giá, Ưu Đãi 20%', 20, 50, 150000, '2023-11-20 00:00:00', @enable, 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fspecial-diascount-banner.png?alt=media', UUID_TO_BIN('accefaab-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('ec5e5e8d-56dc-11ee-8a50-a85e45c41921'), 'Giảm giá, Ưu Đãi 20%', 20, 50, 150000, '2023-11-20 00:00:00', @enable, 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fspecial-diascount-banner.png?alt=media', UUID_TO_BIN('accefe0d-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('accf52f8-5541-11ee-8a50-a85e45c41921'), 'Giảm giá, Ưu Đãi 10%', 10, 40, 90000, '2023-11-20 00:00:00', @enable, 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fspecial-diascount-banner.png?alt=media', null, UUID_TO_BIN('accf4875-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e6233-56dc-11ee-8a50-a85e45c41921'), 'Giảm giá, Ưu Đãi 10%', 10, 40, 90000, '2023-11-20 00:00:00', @enable, 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fspecial-diascount-banner.png?alt=media', null, UUID_TO_BIN('accf4766-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e65cb-56dc-11ee-8a50-a85e45c41921'), 'Giảm giá, Ưu Đãi 10%', 10, 40, 90000, '2023-11-20 00:00:00', @enable, 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fspecial-diascount-banner.png?alt=media', null, UUID_TO_BIN('accf4656-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e68fd-56dc-11ee-8a50-a85e45c41921'), 'Giảm giá, Ưu Đãi 10%', 10, 40, 90000, '2023-11-20 00:00:00', @enable, 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fspecial-diascount-banner.png?alt=media', null, UUID_TO_BIN('accf4547-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e6c43-56dc-11ee-8a50-a85e45c41921'), 'Giảm giá, Ưu Đãi 10%', 10, 40, 90000, '2023-11-20 00:00:00', @enable, 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fspecial-diascount-banner.png?alt=media', null, UUID_TO_BIN('accf4320-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e574e-56dc-11ee-8a50-a85e45c41921'), 'Giảm giá, Ưu Đãi 10%', 10, 40, 90000, '2023-11-20 00:00:00', @enable, 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fspecial-diascount-banner.png?alt=media', UUID_TO_BIN('accefbca-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('accf5414-5541-11ee-8a50-a85e45c41921'), 'Siêu Ưu Đãi Khuyến mãi 35%', 35, 25, 300000, '2023-10-20 00:00:00', @enable, 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fbig-sale.png?alt=media', null, UUID_TO_BIN('accf442f-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf6fdd-5541-11ee-8a50-a85e45c41921'), 'Tuần lễ vàng - Ưu Đãi lớn 25%', 25, 35, 250000, '2023-10-02 00:00:00', @enable, 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fbig-sale.png?alt=media', UUID_TO_BIN('accefe0d-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('accf7135-5541-11ee-8a50-a85e45c41921'), 'Ưu Đãi 5%', 5, 100, 60000, '2023-11-20 00:00:00', @enable, 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fspecial-diascount-banner.png?alt=media', UUID_TO_BIN('accefbca-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('ec5e6db5-56dc-11ee-8a50-a85e45c41921'), 'Ưu Đãi 5%', 5, 100, 60000, '2023-11-20 00:00:00', @enable, 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fspecial-diascount-banner.png?alt=media', null, UUID_TO_BIN('accf3fdf-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5e6f17-56dc-11ee-8a50-a85e45c41921'), 'Ưu Đãi 5%', 5, 100, 60000, '2023-11-20 00:00:00', @enable, 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fspecial-diascount-banner.png?alt=media', UUID_TO_BIN('accefe0d-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('ec5e713f-56dc-11ee-8a50-a85e45c41921'), 'Ưu Đãi 5%', 5, 100, 60000, '2023-11-20 00:00:00', @enable, 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fspecial-diascount-banner.png?alt=media', null, UUID_TO_BIN('accf4656-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf7525-5541-11ee-8a50-a85e45c41921'), 'Giảm giá bất ngờ - Ưu đãi 15%', 15, 25, 15000, '2023-10-15 00:00:00', @enable, 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fspecial-diascount-banner.png?alt=media', UUID_TO_BIN('accf0055-5541-11ee-8a50-a85e45c41921'), null),
            (UUID_TO_BIN('accf7392-5541-11ee-8a50-a85e45c41921'), 'Ưu Đãi Tháng 10 - Giảm giá 20%', 20, 80, 200000, '2023-11-01 00:00:00', @enable, 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fspecial-diascount-banner.png?alt=media', null, UUID_TO_BIN('accf40fe-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf765b-5541-11ee-8a50-a85e45c41921'), 'Ưu Đãi Tháng 8 - Giảm giá 20%', 20, 80, 200000, '2023-09-01 00:00:00', @enable, 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fspecial-diascount-banner.png?alt=media', null, UUID_TO_BIN('accf3fdf-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf77a1-5541-11ee-8a50-a85e45c41921'), 'Ưu Đãi Tháng 9 - Giảm giá 20%', 20, 0, 200000, '2023-10-01 00:00:00', @enable, 'https://firebasestorage.googleapis.com/v0/b/capstone-project-398104.appspot.com/o/public%2Fspecial-diascount-banner.png?alt=media', UUID_TO_BIN('accefbca-5541-11ee-8a50-a85e45c41921'), null);










-- Discount_Product_Category
-- INSERT INTO `saving_hour_market`.`discount_product_category` (`discount_id`, `product_category_id`)
-- --     VALUES (`discount_id`, `product_category_id`)
--     VALUES  (UUID_TO_BIN('accf51d6-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accefbca-5541-11ee-8a50-a85e45c41921')),
--             (UUID_TO_BIN('accf51d6-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accefaab-5541-11ee-8a50-a85e45c41921')),
--             (UUID_TO_BIN('accf6fdd-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accefbca-5541-11ee-8a50-a85e45c41921')),
--             (UUID_TO_BIN('accf6fdd-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accefe0d-5541-11ee-8a50-a85e45c41921')),
--             (UUID_TO_BIN('accf765b-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accefcee-5541-11ee-8a50-a85e45c41921')),
--             (UUID_TO_BIN('accf7135-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0055-5541-11ee-8a50-a85e45c41921')),
--             (UUID_TO_BIN('accf77a1-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accefaab-5541-11ee-8a50-a85e45c41921')),
--             (UUID_TO_BIN('accf7525-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accefaab-5541-11ee-8a50-a85e45c41921'));


-- Discount_Product_Sub_Category
-- INSERT INTO `saving_hour_market`.`discount_product_sub_category` (`discount_id`, `product_sub_category_id`)
-- --     VALUES (`discount_id`, `product_sub_category_id`)
--     VALUES  (UUID_TO_BIN('accf5414-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf442f-5541-11ee-8a50-a85e45c41921')),
--             (UUID_TO_BIN('accf5414-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4766-5541-11ee-8a50-a85e45c41921')),
--             (UUID_TO_BIN('accf5414-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf40fe-5541-11ee-8a50-a85e45c41921')),
--             (UUID_TO_BIN('accf7392-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4210-5541-11ee-8a50-a85e45c41921')),
--             (UUID_TO_BIN('accf7392-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf40fe-5541-11ee-8a50-a85e45c41921')),
--             (UUID_TO_BIN('accf52f8-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4656-5541-11ee-8a50-a85e45c41921')),
--             (UUID_TO_BIN('accf52f8-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4875-5541-11ee-8a50-a85e45c41921')),
--             (UUID_TO_BIN('accf7525-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf3fdf-5541-11ee-8a50-a85e45c41921')),
--             (UUID_TO_BIN('accf7525-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4547-5541-11ee-8a50-a85e45c41921')),
--             (UUID_TO_BIN('accf7135-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf3fdf-5541-11ee-8a50-a85e45c41921')),
--             (UUID_TO_BIN('accf7135-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4656-5541-11ee-8a50-a85e45c41921'));


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
INSERT INTO `saving_hour_market`.`orders` (`id`, `total_price`, `total_discount_price`, `shipping_fee`, `created_time`, `delivery_date`, `payment_method`, `delivery_method`, `payment_status`, `address_deliver`, `receiver_phone`, `receiver_name`, `latitude`, `longitude`, `qr_code_url`, `status`, `customer_id`, `packager_id`, `order_group_id`, `order_batch_id`, `time_frame_id`, `product_consolidation_area_id`, `pickup_point_id`)
--     VALUES (`id`, `total_price`, `shipping_fee`, `created_time`, `delivery_date`, `payment_method`, `address_deliver`, `qr_code_url`, `status`, `customer_id`, `packager_id`, `order_group_id`, `order_batch_id`);
    VALUES  (UUID_TO_BIN('accf7b01-5541-11ee-8a50-a85e45c41921'), 274350, 77650, 19000, '2023-10-17 14:20:00','2023-10-19 14:20:00', @cod, @DoorToDoor, @paid, '240 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, Thành phố Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', 10.827628, 106.721636, 'qr code url here', @success,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), null, null, UUID_TO_BIN('ec5e070b-56dc-11ee-8a50-a85e45c41921'), null, null),

            (UUID_TO_BIN('accf7c79-5541-11ee-8a50-a85e45c41921'), 208800, 139200, 0, '2023-09-14 15:00:00', '2023-09-16 21:00:00', @vnpay, @PickupPoint, @paid, null, null, null, null, null, 'qr code url here', @success,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf2391-5541-11ee-8a50-a85e45c41921'), null, null, null, null),

            (UUID_TO_BIN('accf7dc4-5541-11ee-8a50-a85e45c41921'), 546000, 0, 0, '2023-09-14 13:00:00', '2023-09-16 21:00:00', @cod, @PickupPoint, @unpaid, null, null, null, null, null, 'qr code url here', @cancel,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('accf2391-5541-11ee-8a50-a85e45c41921'), null, null, null, null),

            (UUID_TO_BIN('ec5dcac6-56dc-11ee-8a50-a85e45c41921'), 53600, 13400, 16000, '2023-11-18 13:00:00', '2023-11-19 13:00:00', @vnpay, @DoorToDoor, @paid, '50 Lê Văn Việt, Hiệp Phú, Quận 9, Thành phố Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', 10.847278, 106.776302, 'qr code url here', @processing,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, null, UUID_TO_BIN('ec5def3a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e070b-56dc-11ee-8a50-a85e45c41921'), null, null),

            (UUID_TO_BIN('ec5de351-56dc-11ee-8a50-a85e45c41921'), 216000, 0, 0, '2023-11-18 08:00:00', '2023-11-17 19:00:00', @vnpay, @PickupPoint, @paid, null, null, null, null, null, 'qr code url here', @packaging,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf19db-5541-11ee-8a50-a85e45c41921'), null, null, null, null),

            (UUID_TO_BIN('ec5de6e9-56dc-11ee-8a50-a85e45c41921'), 111000, 0, 0, '2023-11-17 15:00:00', '2023-11-19 19:00:00', @cod, @PickupPoint, @unpaid, null, null, null, null, null, 'qr code url here', @delivering,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf1baa-5541-11ee-8a50-a85e45c41921'), null, null, null, null),

            (UUID_TO_BIN('a4e3cf39-78cf-11ee-a832-a85e45c41921'), 111000, 0, 0, '2024-1-17 15:00:00', '2023-11-19 19:00:00', @cod, @PickupPoint, @unpaid, null, null, null, null, null, 'qr code url here', @success,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf1baa-5541-11ee-8a50-a85e45c41921'), null, null, null, null),

            (UUID_TO_BIN('a4e3bfca-78cf-11ee-a832-a85e45c41921'), 111000, 0, 0, '2024-2-17 15:00:00', '2023-11-19 19:00:00', @cod, @PickupPoint, @unpaid, null, null, null, null, null, 'qr code url here', @success,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf1baa-5541-11ee-8a50-a85e45c41921'), null, null, null, null),

            (UUID_TO_BIN('a4e3c832-78cf-11ee-a832-a85e45c41921'), 111000, 0, 0, '2024-5-17 15:00:00', '2023-11-19 19:00:00', @cod, @PickupPoint, @unpaid, null, null, null, null, null, 'qr code url here', @success,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf4d19-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf1baa-5541-11ee-8a50-a85e45c41921'), null, null, null, null),

            (UUID_TO_BIN('ec5debf5-56dc-11ee-8a50-a85e45c41921'), 304000, 0, 19000, '2023-11-16 12:00:00', '2023-11-19 12:00:00', @cod, @DoorToDoor, @unpaid, '81 Nguyễn Xiển, Long Thạnh Mỹ, Quận 9, Thành phố Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', 10.876725, 106.83843, 'qr code url here', @processing,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, null, null, UUID_TO_BIN('ec5e070b-56dc-11ee-8a50-a85e45c41921'), null, null),
--  dummy order for batching grouping
            (UUID_TO_BIN('a4e3c710-78cf-11ee-a832-a85e45c41921'), 111111, 0, 16000, '2023-11-18 13:00:00', '2023-11-19 13:00:00', @vnpay, @DoorToDoor, @paid, '640 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', 10.84472, 106.82994, 'qr code url here', @packaged,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, null, null, UUID_TO_BIN('ec5e070b-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3bc3a-78cf-11ee-a832-a85e45c41921'), 111111, 0, 16000, '2023-11-18 13:00:00', '2023-11-19 13:00:00', @vnpay, @DoorToDoor, @paid, 'Hẻm 920 Nguyễn Xiển, Long Bình, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', 10.85576, 106.83516, 'qr code url here', @packaged,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, null, null, UUID_TO_BIN('ec5e070b-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3bd5d-78cf-11ee-a832-a85e45c41921'), 111111, 0, 16000, '2023-11-18 13:00:00', '2023-11-19 13:00:00', @vnpay, @DoorToDoor, @paid, '168 Phước Thiện, Quận 9, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', 10.84778, 106.84364, 'qr code url here', @packaged,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, null, null, UUID_TO_BIN('ec5e070b-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3be96-78cf-11ee-a832-a85e45c41921'), 111111, 0, 16000, '2023-11-18 13:00:00', '2023-11-19 13:00:00', @vnpay, @DoorToDoor, @paid, '466 Lê Văn Việt, Tăng Nhơn Phú A, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', 10.84560, 106.79542, 'qr code url here', @packaged,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, null, null, UUID_TO_BIN('ec5e070b-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3c9b6-78cf-11ee-a832-a85e45c41921'), 111111, 0, 16000, '2023-11-18 13:00:00', '2023-11-19 13:00:00', @vnpay, @DoorToDoor, @paid, '30 Đ. Số 102, Tăng Nhơn Phú A, Quận 9, Thành phố Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', 10.84063, 106.78731, 'qr code url here', @packaged,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, null, null, UUID_TO_BIN('ec5e070b-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3c0f2-78cf-11ee-a832-a85e45c41921'), 111111, 0, 16000, '2023-11-18 13:00:00', '2023-11-19 13:00:00', @vnpay, @DoorToDoor, @paid, '94 Man Thiện, Tăng Nhơn Phú A, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', 10.84816, 106.78724, 'qr code url here', @packaged,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, null, null, UUID_TO_BIN('ec5e070b-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3c284-78cf-11ee-a832-a85e45c41921'), 111111, 0, 16000, '2023-11-18 13:00:00', '2023-11-19 13:00:00', @vnpay, @DoorToDoor, @paid, '224 Nguyễn Thị Định, Bình Trưng Tây, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', 10.78563, 106.75665, 'qr code url here', @packaged,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, null, null, UUID_TO_BIN('ec5e070b-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3c3af-78cf-11ee-a832-a85e45c41921'), 111111, 0, 16000, '2023-11-18 13:00:00', '2023-11-19 13:00:00', @vnpay, @DoorToDoor, @paid, '462 Mai Chí Thọ, Bình Khánh, Quận 2, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', 10.78203, 106.74052, 'qr code url here', @packaged,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, null, null, UUID_TO_BIN('ec5e070b-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3c4cf-78cf-11ee-a832-a85e45c41921'), 111111, 0, 16000, '2023-11-18 13:00:00', '2023-11-19 13:00:00', @vnpay, @DoorToDoor, @paid, '133 Đồng Văn Cống, Thạnh Mỹ Lợi, Quận 2, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', 10.77341, 106.76333, 'qr code url here', @packaged,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, null, null, UUID_TO_BIN('ec5e070b-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3c5ee-78cf-11ee-a832-a85e45c41921'), 111111, 0, 16000, '2023-11-18 13:00:00', '2023-11-19 13:00:00', @vnpay, @DoorToDoor, @paid, '91 Nguyễn Hoàng, An Phú, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', 10.79592, 106.74515, 'qr code url here', @packaged,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, null, null, UUID_TO_BIN('ec5e070b-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
--  dummy order for order group
    --order group id: 'a4e3cae1-78cf-11ee-a832-a85e45c41921'
    --pickup point: Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh (accf0ac0-5541-11ee-8a50-a85e45c41921) -- time frame: '08:00:00', '09:30:00' (ec5e05ac-56dc-11ee-8a50-a85e45c41921)
            (UUID_TO_BIN('a4e3d8af-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaging,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3cae1-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e05ac-56dc-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3d9fb-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaging,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3cae1-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e05ac-56dc-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3dbd2-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaging,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3cae1-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e05ac-56dc-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3dd15-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaging,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3cae1-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e05ac-56dc-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3de53-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaging,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3cae1-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e05ac-56dc-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
    --order group id: 'a4e3cc1d-78cf-11ee-a832-a85e45c41921'
    --pickup point: Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh (accf0ac0-5541-11ee-8a50-a85e45c41921) -- time frame: '14:00:00', '15:30:00' (ec5e099f-56dc-11ee-8a50-a85e45c41921)
            (UUID_TO_BIN('a4e3df91-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaging,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3cc1d-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e099f-56dc-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3e0c5-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaging,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3cc1d-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e099f-56dc-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3e209-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaging,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3cc1d-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e099f-56dc-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3e345-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaging,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3cc1d-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e099f-56dc-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3e479-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaging,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3cc1d-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e099f-56dc-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
    --order group id: 'a4e3cdbb-78cf-11ee-a832-a85e45c41921' (have consolidation area)
    --consolidation area id: 'ec5dfa4a-56dc-11ee-8a50-a85e45c41921'
    --pickup point: Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh (accf0ac0-5541-11ee-8a50-a85e45c41921) -- time frame: 10:00:00', '11:30:00' (ec5e070b-56dc-11ee-8a50-a85e45c41921)
            (UUID_TO_BIN('a4e3e5a1-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaged,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3cdbb-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e070b-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3e73b-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaged,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3cdbb-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e070b-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3e8dc-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaged,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3cdbb-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e070b-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3ea2a-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaged,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3cdbb-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e070b-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3ebff-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaged,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3cdbb-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e070b-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0ac0-5541-11ee-8a50-a85e45c41921')),
    --order group id: 'a4e3d067-78cf-11ee-a832-a85e45c41921'
    --pickup point: 432 Đ. Liên Phường, Phước Long B, Quận 9, Hồ Chí Minh (accf0d06-5541-11ee-8a50-a85e45c41921) -- time frame: '14:00:00', '15:30:00' (ec5e099f-56dc-11ee-8a50-a85e45c41921)
            (UUID_TO_BIN('a4e3ed59-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaging,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3d067-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e099f-56dc-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3eeab-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaging,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3d067-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e099f-56dc-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3efcb-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaging,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3d067-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e099f-56dc-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3f0f2-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaging,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3d067-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e099f-56dc-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3f216-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaging,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3d067-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e099f-56dc-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921')),
    --order group id: 'a4e3d18e-78cf-11ee-a832-a85e45c41921' (have consolidation area)
    --consolidation area id: 'ec5dfa4a-56dc-11ee-8a50-a85e45c41921'
    --pickup point: 432 Đ. Liên Phường, Phước Long B, Quận 9, Hồ Chí Minh (accf0d06-5541-11ee-8a50-a85e45c41921) -- time frame: 12:00:00', '13:30:00 (ec5e0855-56dc-11ee-8a50-a85e45c41921)
            (UUID_TO_BIN('a4e3f3cb-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaged,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3d18e-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e0855-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3f500-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaged,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3d18e-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e0855-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3f643-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaged,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3d18e-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e0855-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3f76b-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaged,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3d18e-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e0855-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3f88f-78cf-11ee-a832-a85e45c41921'), 208800, 139200, 0, '2023-11-18 13:00:00', '2023-11-20 13:00:00', @vnpay, @PickupPoint, @paid, 'Hẻm 662 Nguyễn Xiển, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh', '0902828618', 'Luu Gia Vinh', null, null, 'qr code url here', @packaged,
             UUID_TO_BIN('accef2db-5541-11ee-8a50-a85e45c41921'), null, UUID_TO_BIN('a4e3d18e-78cf-11ee-a832-a85e45c41921'), null, UUID_TO_BIN('ec5e0855-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dfa4a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf0d06-5541-11ee-8a50-a85e45c41921'));


-- Order discount
INSERT INTO `saving_hour_market`.`discount_order` (`discount_id`, `order_id`)
    VALUES  (UUID_TO_BIN('accf51d6-5541-11ee-8a50-a85e45c41921'),UUID_TO_BIN('accf7b01-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf6fdd-5541-11ee-8a50-a85e45c41921'),UUID_TO_BIN('accf7b01-5541-11ee-8a50-a85e45c41921')),

--             (UUID_TO_BIN('accf6fdd-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf7c79-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf51d6-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf7c79-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf7392-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf7c79-5541-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('accf77a1-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dcac6-56dc-11ee-8a50-a85e45c41921'));
--             (UUID_TO_BIN('accf52f8-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5dcac6-56dc-11ee-8a50-a85e45c41921'));



-- Order Detail
INSERT INTO `saving_hour_market`.`order_detail` (`id`, `product_id`, `bought_quantity`, `product_price`, `product_original_price`, `order_id`)
--     VALUES (`id`, `product_id`, `bought_quantity`, `product_original_price`, `product_price`, `order_id`);
    VALUES  (UUID_TO_BIN('accf7ee5-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf2d37-5541-11ee-8a50-a85e45c41921'), 1, 90000, 75000, UUID_TO_BIN('accf7b01-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf8026-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf2f65-5541-11ee-8a50-a85e45c41921'), 1, 75000, 62000, UUID_TO_BIN('accf7b01-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf814e-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf377f-5541-11ee-8a50-a85e45c41921'), 1, 42000, 35000, UUID_TO_BIN('accf7b01-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf8271-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf3664-5541-11ee-8a50-a85e45c41921'), 1, 145000, 120000, UUID_TO_BIN('accf7b01-5541-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('accf8390-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf2c1d-5541-11ee-8a50-a85e45c41921'), 2, 55000, 48000, UUID_TO_BIN('accf7c79-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf84af-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf3be3-5541-11ee-8a50-a85e45c41921'), 1, 58000, 49000, UUID_TO_BIN('accf7c79-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf864a-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf2d37-5541-11ee-8a50-a85e45c41921'), 2, 90000, 75000, UUID_TO_BIN('accf7c79-5541-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('accf8775-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf3ac4-5541-11ee-8a50-a85e45c41921'), 2, 88000, 75000, UUID_TO_BIN('accf7dc4-5541-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('accf88e1-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf39b0-5541-11ee-8a50-a85e45c41921'), 2, 185000, 155000, UUID_TO_BIN('accf7dc4-5541-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('ec5ddff7-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf343c-5541-11ee-8a50-a85e45c41921'), 1, 42000, 35000, UUID_TO_BIN('ec5dcac6-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5de21a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf3552-5541-11ee-8a50-a85e45c41921'), 1, 25000, 21000, UUID_TO_BIN('ec5dcac6-56dc-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('ec5de48d-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf39b0-5541-11ee-8a50-a85e45c41921'), 1, 185000, 155000, UUID_TO_BIN('ec5de351-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5de5be-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf3cf4-5541-11ee-8a50-a85e45c41921'), 1, 31000, 27000, UUID_TO_BIN('ec5de351-56dc-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('ec5de94e-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf3079-5541-11ee-8a50-a85e45c41921'), 1, 60000, 49000, UUID_TO_BIN('ec5de6e9-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5dea86-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf3897-5541-11ee-8a50-a85e45c41921'), 1, 51000, 42000, UUID_TO_BIN('ec5de6e9-56dc-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('ec5ded18-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf2b04-5541-11ee-8a50-a85e45c41921'), 1, 159000, 130000, UUID_TO_BIN('ec5debf5-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('ec5dee28-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('accf3664-5541-11ee-8a50-a85e45c41921'), 1, 145000, 120000, UUID_TO_BIN('ec5debf5-56dc-11ee-8a50-a85e45c41921'));


INSERT INTO `saving_hour_market`.`order_detail_product_batch` (`id`, `bought_quantity`, `order_detail_id`, `product_batch_id`)
--     VALUES (`id`, `bought_quantity`, `order_detail_id`, `product_batch_id`)
    VALUES  (UUID_TO_BIN('a4e34831-78cf-11ee-a832-a85e45c41921'), 1, UUID_TO_BIN('accf7ee5-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5ea9a5-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e37581-78cf-11ee-a832-a85e45c41921'), 1, UUID_TO_BIN('accf8026-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5eab5f-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e37825-78cf-11ee-a832-a85e45c41921'), 1, UUID_TO_BIN('accf814e-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e4897-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e37971-78cf-11ee-a832-a85e45c41921'), 1, UUID_TO_BIN('accf8271-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e44d1-56dc-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('a4e37a97-78cf-11ee-a832-a85e45c41921'), 2, UUID_TO_BIN('accf8390-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5ea831-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e37ce4-78cf-11ee-a832-a85e45c41921'), 1, UUID_TO_BIN('accf84af-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e7bef-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e37e21-78cf-11ee-a832-a85e45c41921'), 2, UUID_TO_BIN('accf864a-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5ea9a5-56dc-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('a4e37f43-78cf-11ee-a832-a85e45c41921'), 2, UUID_TO_BIN('accf8775-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e744a-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e3806f-78cf-11ee-a832-a85e45c41921'), 2, UUID_TO_BIN('accf88e1-5541-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e4e60-56dc-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('a4e381a1-78cf-11ee-a832-a85e45c41921'), 1, UUID_TO_BIN('ec5ddff7-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5eaf69-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e382c5-78cf-11ee-a832-a85e45c41921'), 1, UUID_TO_BIN('ec5de21a-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5eb268-56dc-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('a4e38430-78cf-11ee-a832-a85e45c41921'), 1, UUID_TO_BIN('ec5de48d-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e4e60-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e38565-78cf-11ee-a832-a85e45c41921'), 1, UUID_TO_BIN('ec5de5be-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e7e0c-56dc-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('a4e3868c-78cf-11ee-a832-a85e45c41921'), 1, UUID_TO_BIN('ec5de94e-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5eae10-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e387af-78cf-11ee-a832-a85e45c41921'), 1, UUID_TO_BIN('ec5dea86-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e4cbe-56dc-11ee-8a50-a85e45c41921')),

            (UUID_TO_BIN('a4e388cb-78cf-11ee-a832-a85e45c41921'), 1, UUID_TO_BIN('ec5ded18-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5ea50d-56dc-11ee-8a50-a85e45c41921')),
            (UUID_TO_BIN('a4e38abf-78cf-11ee-a832-a85e45c41921'), 1, UUID_TO_BIN('ec5dee28-56dc-11ee-8a50-a85e45c41921'), UUID_TO_BIN('ec5e44d1-56dc-11ee-8a50-a85e45c41921'));

-- UUID gen























































-- 'a4e3f9b1-78cf-11ee-a832-a85e45c41921'
-- 'a4e3d2b5-78cf-11ee-a832-a85e45c41921'
-- 'a4e3d3d8-78cf-11ee-a832-a85e45c41921'
-- 'a4e3d4f4-78cf-11ee-a832-a85e45c41921'
-- 'a4e3d62a-78cf-11ee-a832-a85e45c41921'
-- 'a4e3d74a-78cf-11ee-a832-a85e45c41921'
-- 'a4e3fae1-78cf-11ee-a832-a85e45c41921'
-- 'a4e3fc06-78cf-11ee-a832-a85e45c41921'
-- 'a4e3fd37-78cf-11ee-a832-a85e45c41921'
-- 'a4e3fe5c-78cf-11ee-a832-a85e45c41921'
-- 'a4e3ffb9-78cf-11ee-a832-a85e45c41921'









