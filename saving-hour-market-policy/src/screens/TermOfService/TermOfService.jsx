import React, { useEffect, useState } from "react";
import { API } from "../../constant/api";

const TermOfService = () => {
  const [limitOfOrders, setLimitOfOrders] = useState(0);
  const [timeAllowedForOrderCancellation, setTimeAllowedForOrderCancellation] =
    useState(0);

  useEffect(() => {
    const fetchStaff = async () => {
      fetch(`${API.baseURL}/api/configuration/getConfiguration`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((respond) => {
          console.log(respond);
          if (respond?.code === 404 || respond.status === 500) {
            return;
          }

          setLimitOfOrders(respond.limitOfOrders);

          setTimeAllowedForOrderCancellation(
            respond.timeAllowedForOrderCancellation
          );
        })
        .catch((err) => console.log(err));
    };
    fetchStaff();
  });
  return (
    <div className="policy__container">
      <h1 className="policy__main-title">ĐIỀU KHOẢN DỊCH VỤ</h1>
      <h3 className="policy__sub-title">1. GIỚI THIỆU</h3>
      <p className="policy__content">
        <br />
        1.1 Chào mừng bạn đến với sàn giao dịch thương mại điện tử SVH qua giao
        diện website hoặc ứng dụng di động (“Trang SVH”). Trước khi sử dụng
        Trang SVH hoặc tạo tài khoản SVH (“Tài Khoản”), vui lòng đọc kỹ các Điều
        Khoản Dịch Vụ dưới đây và Quy Chế Hoạt Động Sàn Giao Dịch Thương Mại
        Điện Tử SVH để hiểu rõ quyền lợi và nghĩa vụ hợp pháp của mình đối với
        Công ty TNHH SVH và các công ty liên kết và công ty con của SVH (sau đây
        được gọi riêng là “SVH”, gọi chung là “chúng tôi”, “của chúng tôi”).
        “Dịch Vụ” chúng tôi cung cấp hoặc sẵn có bao gồm (a) Trang SVH, (b) các
        dịch vụ được cung cấp bởi Trang SVH và bởi phần mềm dành cho khách hàng
        của SVH có sẵn trên Trang SVH, và (c) tất cả các thông tin, đường dẫn,
        tính năng, dữ liệu, văn bản, hình ảnh, biểu đồ, âm nhạc, âm thanh, video
        (bao gồm cả các đoạn video được đăng tải trực tiếp theo thời gian thực
        (livestream)), tin nhắn, tags, nội dung, chương trình, phần mềm, ứng
        dụng dịch vụ (bao gồm bất kỳ ứng dụng dịch vụ di động nào) hoặc các tài
        liệu khác có sẵn trên Trang SVH hoặc các dịch vụ liên quan đến Trang SVH
        (“Nội Dung”). Bất kỳ tính năng mới nào được bổ sung hoặc mở rộng đối với
        Dịch Vụ đều thuộc phạm vi điều chỉnh của Điều Khoản Dịch Vụ này. Điều
        Khoản Dịch Vụ này điều chỉnh việc bạn sử dụng Dịch Vụ cung cấp bởi SVH.
        <br></br>
        <br></br> 1.2 Dịch Vụ bao gồm dịch vụ sàn giao dịch trực tuyến kết nối
        người tiêu dùng với nhau nhằm mang đến cơ hội kinh doanh giữa người mua
        (“Người Mua”) và người bán (“Người Bán”) (gọi chung là “bạn”, “Người Sử
        Dụng” hoặc “Các Bên”). Hợp đồng mua bán thật sự là trực tiếp giữa Người
        Mua và Người Bán. Các Bên liên quan đến giao dịch đó sẽ chịu trách nhiệm
        đối với hợp đồng mua bán giữa họ, việc đăng bán hàng hóa, bảo hành sản
        phẩm và tương tự. SVH không can thiệp vào giao dịch giữa các Người Sử
        Dụng. SVH có thể hoặc không sàng lọc trước Người Sử Dụng hoặc Nội Dung
        hoặc thông tin cung cấp bởi Người Sử Dụng. SVH bảo lưu quyền loại bỏ bất
        cứ Nội Dung hoặc thông tin nào trên Trang SVH theo Mục 6.4 bên dưới. SVH
        không bảo đảm cho việc các Người Sử Dụng sẽ thực tế hoàn thành giao
        dịch. Lưu ý, SVH sẽ là bên trung gian quản lý tình trạng hàng hóa và mua
        bán giữa Người Mua và Người Bán và quản lý vấn đề chuyển phát, trừ khi
        Người Mua và Người Bán thể hiện mong muốn tự giao dịch với nhau một cách
        rõ ràng.<br></br> <br></br> 1.3 Trước khi trở thành Người Sử Dụng của
        Trang SVH, bạn cần đọc và chấp nhận mọi điều khoản và điều kiện được quy
        định trong, và dẫn chiếu đến, Điều Khoản Dịch Vụ này và Chính Sách Bảo
        Mật được dẫn chiếu theo đây.<br></br> <br></br> 1.4 SVH bảo lưu quyền
        thay đổi, chỉnh sửa, tạm ngưng hoặc chấm dứt tất cả hoặc bất kỳ phần nào
        của Trang SVH hoặc Dịch Vụ vào bất cứ thời điểm nào theo quy định pháp
        luật. Phiên Bản thử nghiệm của Dịch Vụ hoặc tính năng của Dịch Vụ có thể
        không hoàn toàn giống với phiên bản cuối cùng.<br></br> <br></br> 1.5
        SVH bảo lưu quyền từ chối yêu cầu mở Tài Khoản hoặc các truy cập của bạn
        tới Trang SVH hoặc Dịch Vụ theo quy định pháp luật và Điều khoản dịch
        vụ. BẰNG VIỆC SỬ DỤNG DỊCH VỤ HAY TẠO TÀI KHOẢN TẠI SVH, BẠN ĐÃ CHẤP
        NHẬN VÀ ĐỒNG Ý VỚI NHỮNG ĐIỀU KHOẢN DỊCH VỤ NÀY VÀ CHÍNH SÁCH BỔ SUNG
        ĐƯỢC DẪN CHIẾU THEO ĐÂY. NẾU BẠN KHÔNG ĐỒNG Ý VỚI NHỮNG ĐIỀU KHOẢN DỊCH
        VỤ NÀY, VUI LÒNG KHÔNG SỬ DỤNG DỊCH VỤ HOẶC TRUY CẬP VÀO TRANG SVH. NẾU
        BẠN LÀ NGƯỜI CHƯA THÀNH NIÊN HOẶC BỊ GIỚI HẠN VỀ NĂNG LỰC HÀNH VI DÂN SỰ
        THEO QUY ĐỊNH PHÁP LUẬT TẠI QUỐC GIA BẠN SINH SỐNG, BẠN CẦN NHẬN ĐƯỢC SỰ
        HỖ TRỢ HOẶC CHẤP THUẬN TỪ CHA MẸ HOẶC NGƯỜI GIÁM HỘ HỢP PHÁP, TÙY TỪNG
        TRƯỜNG HỢP ÁP DỤNG, ĐỂ MỞ TÀI KHOẢN HOẶC SỬ DỤNG DỊCH VỤ. TRONG TRƯỜNG
        HỢP ĐÓ, CHA MẸ HOẶC NGƯỜI GIÁM HỘ HỢP PHÁP, TÙY TỪNG TRƯỜNG HỢP ÁP DỤNG,
        CẦN HỖ TRỢ ĐỂ BẠN HIỂU RÕ HOẶC THAY MẶT BẠN CHẤP NHẬN NHỮNG ĐIỀU KHOẢN
        TRONG THỎA THUẬN DỊCH VỤ NÀY. NẾU BẠN CHƯA CHẮC CHẮN VỀ ĐỘ TUỔI CŨNG NHƯ
        NĂNG LỰC HÀNH VI DÂN SỰ CỦA MÌNH, HOẶC CHƯA HIỂU RÕ CÁC ĐIỀU KHOẢN NÀY
        CŨNG NHƯ QUY ĐỊNH PHÁP LUẬT CÓ LIÊN QUAN ÁP DỤNG CHO ĐỘ TUỔI HOẶC NĂNG
        LỰC HÀNH VI DÂN SỰ CỦA MÌNH, VUI LÒNG KHÔNG TẠO TÀI KHOẢN HOẶC SỬ DỤNG
        DỊCH VỤ CHO ĐẾN KHI NHẬN ĐƯỢC SỰ GIÚP ĐỠ TỪ CHA MẸ HOẶC NGƯỜI GIÁM HỘ
        HỢP PHÁP. NẾU BẠN LÀ CHA MẸ HOẶC NGƯỜI GIÁM HỘ HỢP PHÁP CỦA NGƯỜI CHƯA
        THÀNH NIÊN HOẶC BỊ GIỚI HẠN VỀ NĂNG LỰC HÀNH VI DÂN SỰ, TÙY TỪNG TRƯỜNG
        HỢP THEO QUY ĐỊNH PHÁP LUẬT, BẠN CẦN HỖ TRỢ ĐỂ NGƯỜI ĐƯỢC GIÁM HỘ HIỂU
        RÕ HOẶC ĐẠI DIỆN NGƯỜI ĐƯỢC GIÁM HỘ CHẤP NHẬN CÁC ĐIỀU KHOẢN DỊCH VỤ NÀY
        VÀ CHỊU TRÁCH NHIỆM ĐỐI VỚI TOÀN BỘ QUÁ TRÌNH SỬ DỤNG TÀI KHOẢN HOẶC CÁC
        DỊCH VỤ CỦA SVH MÀ KHÔNG PHÂN BIỆT TÀI KHOẢN ĐÃ HOẶC SẼ ĐƯỢC TẠO LẬP.
      </p>
      <h3 className="policy__sub-title">2. QUYỀN RIÊNG TƯ</h3>
      <p className="policy__content">
        <br />
        2.1 SVH coi trọng việc bảo mật thông tin của bạn. Để bảo vệ quyền lợi
        người dùng, SVH cung cấp Chính Sách Bảo Mật tại SVH.vn để giải thích chi
        tiết các hoạt động bảo mật của SVH. Vui lòng tham khảo Chính Sách Bảo
        Mật để biết cách thức SVH thu thập và sử dụng thông tin liên quan đến
        Tài Khoản và/hoặc việc sử dụng Dịch Vụ của Người Sử Dụng (“Thông Tin
        Người Sử Dụng”). Điều Khoản Dịch Vụ này có liên quan mật thiết với Chính
        Sách Bảo Mật. Bằng cách sử dụng Dịch Vụ hoặc cung cấp thông tin trên
        Trang SVH, Người Sử Dụng:
      </p>
      <p className="policy__content">
        a. cho phép SVH thu thập, sử dụng, công bố và/hoặc xử lý các Nội Dung,
        dữ liệu cá nhân của bạn và Thông Tin Người Sử Dụng như được quy định
        trong Chính Sách Bảo Mật;
      </p>
      <p className="policy__content">
        b. đồng ý và công nhận rằng các thông tin được cung cấp trên Trang SVH
        sẽ thuộc sở hữu chung của bạn và SVH; và
      </p>
      <p className="policy__content">
        c. sẽ không, dù là trực tiếp hay gián tiếp, tiết lộ các Thông Tin Người
        Sử Dụng cho bất kỳ bên thứ ba nào, hoặc bằng bất kỳ phương thức nào cho
        phép bất kỳ bên thứ ba nào được truy cập hoặc sử dụng Thông Tin Người
        Dùng của bạn.
      </p>
      <p className="policy__content">
        <br />
        2.2 Trường hợp Người Sử Dụng sở hữu dữ liệu cá nhân của Người Sử Dụng
        khác thông qua việc sử dụng Dịch Vụ (“Bên Nhận Thông Tin”) theo đây đồng
        ý rằng, mình sẽ (i) tuân thủ mọi quy định pháp luật về bảo vệ an toàn
        thông tin cá nhân liên quan đến những thông tin đó; (ii) cho phép Người
        Sử Dụng là chủ sở hữu của các thông tin cá nhân mà Bên Nhận Thông Tin
        thu thập được (“Bên Tiết Lộ Thông Tin”) được phép xóa bỏ thông tin của
        mình được thu thập từ cơ sở dữ liệu của Bên Nhận Thông Tin; và (iii) cho
        phép Bên Tiết Lộ Thông Tin rà soát những thông tin đã được thu thập về
        họ bởi Bên Nhận Thông Tin, phù hợp với hoặc theo yêu cầu của các quy
        định pháp luật hiện hành.
      </p>
      <h3 className="policy__sub-title">3. GIỚI HẠN TRÁCH NHIỆM</h3>
      <p className="policy__content">
        <br />
        3.1 SVH trao cho Người Sử Dụng quyền phù hợp để truy cập và sử dụng các
        Dịch Vụ theo các điều khoản và điều kiện được quy định trong Điều Khoản
        Dịch Vụ này. Tất cả các Nội Dung, thương hiệu, nhãn hiệu dịch vụ, tên
        thương mại, biểu tượng và tài sản sở hữu trí tuệ khác độc quyền (“Tài
        Sản Sở Hữu Trí Tuệ”) hiển thị trên Trang SVH đều thuộc sở hữu của SVH và
        bên sở hữu thứ ba, nếu có. Không một bên nào truy cập vào Trang SVH được
        cấp quyền hoặc cấp phép trực tiếp hoặc gián tiếp để sử dụng hoặc sao
        chép bất kỳ Tài Sản Sở Hữu Trí Tuệ nào, cũng như không một bên nào truy
        cập vào Trang SVH được phép truy đòi bất kỳ quyền, quyền sở hữu hoặc lợi
        ích nào liên quan đến Tài Sản Sở Hữu Trí Tuệ. Bằng cách sử dụng hoặc
        truy cập Dịch Vụ, bạn đồng ý tuân thủ các quy định pháp luật liên quan
        đến bản quyền, thương hiệu, nhãn hiệu dịch vụ hoặc bất cứ quy định pháp
        luật nào khác bảo vệ Dịch Vụ, Trang SVH và Nội Dung của Trang SVH. Bạn
        đồng ý không được phép sao chép, phát tán, tái bản, chuyển giao, công bố
        công khai, thực hiện công khai, sửa đổi, phỏng tác, cho thuê, bán, hoặc
        tạo ra các sản phẩm phái sinh của bất cứ phần nào thuộc Dịch Vụ, Trang
        SVH và Nội Dung của Trang SVH. Bạn không được nhân bản hoặc chỉnh sửa
        bất kỳ phần nào hoặc toàn bộ nội dung của Trang SVH trên bất kỳ máy chủ
        hoặc như là một phần của bất kỳ website nào khác mà chưa nhận được sự
        chấp thuận bằng văn bản của SVH. Ngoài ra, bạn đồng ý rằng bạn sẽ không
        sử dụng bất kỳ robot, chương trình do thám (spider) hay bất kỳ thiết bị
        tự động hoặc phương thức thủ công nào để theo dõi hoặc sao chép Nội Dung
        của SVH khi chưa có sự đồng ý trước bằng văn bản của SVH (sự chấp thuận
        này được xem như áp dụng cho các công cụ tìm kiếm cơ bản trên các
        website tìm kiếm trên mạng kết nối người dùng trực tiếp đến website đó).
        <br /> <br />
        3.2 SVH cho phép kết nối từ website Người Sử Dụng đến Trang SVH, với
        điều kiện website của Người Sử Dụng không được hiểu là bất kỳ việc xác
        nhận hoặc liên quan nào đến SVH.
      </p>
      <h3 className="policy__sub-title">4. ĐIỀU KHOẢN SỬ DỤNG</h3>
      <p className="policy__content">
        <br />
        4.1 Quyền được phép sử dụng Trang SVH và Dịch Vụ có hiệu lực cho đến khi
        bị chấm dứt. Quyền được phép sử dụng sẽ bị chấm dứt theo Điều Khoản Dịch
        Vụ này hoặc trường hợp Người Sử Dụng vi phạm bất cứ điều khoản hoặc điều
        kiện nào được quy định tại Điều Khoản Dịch Vụ này. Trong trường hợp đó,
        SVH có thể chấm dứt việc sử dụng của Người Sử Dụng bằng hoặc không cần
        thông báo. <br /> <br /> 4.2 Người Sử Dụng không được phép: (a) tải lên,
        đăng, truyền tải hoặc bằng cách khác công khai bất cứ Nội Dung nào trái
        pháp luật, có hại, đe dọa, lạm dụng, quấy rối, gây hoang mang, lo lắng,
        xuyên tạc, phỉ báng, xúc phạm, khiêu dâm, bôi nhọ, xâm phạm quyền riêng
        tư của người khác, gây căm phẫn, hoặc phân biệt chủng tộc, dân tộc hoặc
        bất kỳ nội dung không đúng đắn nào khác; (b) vi phạm pháp luật, quyền
        lợi của bên thứ ba hoặc Chính Sách Cấm/Hạn Chế Sản Phẩm của SVH; (c)
        đăng tải, truyền tin, hoặc bằng bất kỳ hình thức nào khác hiển thị bất
        kỳ Nội dung nào có sự xuất hiện của người chưa thành niên hoặc sử dụng
        Dịch vụ gây tổn hại cho người chưa thành niên dưới bất kỳ hình thức nào;
        (d) sử dụng Dịch Vụ hoặc đăng tải Nội Dung để mạo danh bất kỳ cá nhân
        hoặc tổ chức nào, hoặc bằng cách nào khác xuyên tạc cá nhân hoặc tổ
        chức; (e) giả mạo các tiêu đề hoặc bằng cách khác ngụy tạo các định dạng
        nhằm che giấu nguồn gốc của bất kỳ Nội Dung nào được truyền tải thông
        qua Dịch Vụ; (f) gỡ bỏ bất kỳ thông báo độc quyền nào từ Trang SVH; (g)
        gây ra, chấp nhận hoặc ủy quyền cho việc sửa đổi, cấu thành các sản phẩm
        phái sinh, hoặc chuyển thể của Dịch Vụ mà không được sự cho phép rõ ràng
        của SVH; (h) sử dụng Dịch Vụ phục vụ lợi ích của bất kỳ bên thứ ba nào
        hoặc bất kỳ hành vi nào không được chấp nhận theo Điều Khoản Dịch Vụ
        này; (i) sử dụng Dịch Vụ hoặc đăng tải Nội Dung cho mục đích gian lận,
        không hợp lý, sai trái, gây hiểu nhầm hoặc gây nhầm lẫn; (j) mở và vận
        hành nhiều tài khoản người dùng khác nhau liên quan đến bất kỳ hành vi
        nào vi phạm điều khoản hoặc tinh thần của Điều Khoản Dịch Vụ này; (k)
        truy cập sàn giao dịch thương mại điện tử SVH, mở tài khoản hoặc bằng
        cách khác truy cập tài khoản người dùng của mình thông qua bất kỳ phần
        mềm hoặc phần cứng không được chấp thuận hoặc cung cấp bởi SVH, bao gồm
        phần mềm giả lập, thiết bị giả lập, phần mềm tự động hoặc bất kỳ phần
        mềm, thiết bị hoặc phần cứng nào có chức năng tương tự. (l) chỉnh sửa
        giá của bất kỳ sản phẩm nào hoặc can thiệp vào danh mục hàng hóa của
        Người Sử Dụng khác. (m) thực hiện bất kỳ hành động nào làm sai lệch hệ
        thống đánh giá hoặc tiếp nhận phản hồi của SVH; (n) cố gắng chuyển đổi
        mã chương trình, đảo ngược kỹ thuật, tháo gỡ hoặc xâm nhập (hack) Dịch
        Vụ (hoặc bất cứ hợp phần nào theo đó); hoặc phá bỏ hoặc vượt qua bất kỳ
        công nghệ mã hóa hoặc biện pháp bảo mật nào được SVH áp dụng đối với các
        Dịch Vụ và/hoặc các dữ liệu được truyền tải, xử lý hoặc lưu trữ bởi SVH;
        (o) khai thác hoặc thu thập bất kỳ thông tin nào liên quan đến Tài Khoản
        của Người Sử Dụng khác, bao gồm bất kỳ thông tin hoặc dữ liệu cá nhân
        nào; (p) tải lên, gửi thư điện tử, đăng, chuyển tải hoặc bằng cách khác
        công khai bất kỳ Nội Dung nào mà bạn không được cho phép theo bất kỳ
        luật hoặc quan hệ hợp đồng hoặc tín thác nào (chẳng hạn thông tin nội
        bộ, thông tin độc quyền và thông tin mật được biết hoặc tiết lộ như một
        phần của quan hệ lao động hoặc theo các thỏa thuận bảo mật); (q) tải
        lên, gửi thư điện tử, đăng, chuyển tải hoặc bằng cách khác công khai bất
        kỳ Nội Dung nào dẫn đến trường hợp vi phạm các quyền về sáng chế, thương
        hiệu, bí quyết kinh doanh, bản quyền hoặc bất cứ đặc quyền nào của bất
        cứ bên nào; (r) tải lên, gửi thư điện tử, đăng, chuyển tải hoặc bằng
        cách khác công khai bất kỳ quảng cáo, các tài liệu khuyến mại, “thư quấy
        rối”, “thư rác”, “chuỗi ký tự” không được phép hoặc không hợp pháp, hoặc
        bất kỳ hình thức lôi kéo không được phép nào khác; (s) tải lên, gửi thư
        điện tử, đăng, chuyển tải hoặc bằng cách khác công khai bất cứ tài liệu
        chứa các loại vi-rút, worm, trojan hoặc bất kỳ các mã, tập tin hoặc
        chương trình máy tính được thiết kế để trực tiếp hoặc gián tiếp gây cản
        trở, điều khiển, gián đoạn, phá hỏng hoặc hạn chế các chức năng hoặc
        tổng thể của bất kỳ phần mềm hoặc phần cứng hoặc dữ liệu hoặc thiết bị
        viễn thông của máy tính; (t) làm gián đoạn các dòng tương tác thông
        thường, đẩy nhanh tốc độ “lướt (scroll)” màn hình hơn những Người Sử
        Dụng khác có thể đối với Dịch Vụ, hoặc bằng cách khác thực hiện thao tác
        gây ảnh hưởng tiêu cực đến khả năng tham gia giao dịch thực của những
        Người Sử Dụng khác, (u) can thiệp, điều khiển hoặc làm gián đoạn Dịch Vụ
        hoặc máy chủ hoặc hệ thống được liên kết với Dịch Vụ hoặc tới việc sử
        dụng và trải nghiệm Dịch Vụ của Người Sử Dụng khác, hoặc không tuân thủ
        bất kỳ các yêu cầu, quy trình, chính sách và luật lệ đối với các hệ
        thống được liên kết với Trang SVH; (v) thực hiện bất kỳ hành động hoặc
        hành vi nào có thể trực tiếp hoặc gián tiếp phá hủy, vô hiệu hóa, làm
        quá tải, hoặc làm suy yếu Dịch Vụ hoặc máy chủ hoặc hệ thống liên kết
        với Dịch Vụ; (w) sử dụng Dịch Vụ để vi phạm pháp luật, quy chế, quy tắc,
        chỉ thị, hướng dẫn, chính sách áp dụng của địa phương, liên bang, quốc
        gia hoặc quốc tế (có hoặc chưa có hiệu lực) một cách có chủ ý hoặc vô ý
        liên quan đến phòng chống rửa tiền hoặc phòng chống khủng bố; (x) sử
        dụng Dịch Vụ để vi phạm hoặc phá vỡ bất kỳ hình phạt hay lệnh cấm vận
        nào được quản lý hay thực thi bởi các cơ quan có liên quan. (y) sử dụng
        Dịch Vụ để xâm hại tới quyền riêng tư của người khác hoặc để “lén theo
        dõi” hoặc bằng cách khác quấy rối người khác; (z) xâm phạm các quyền của
        SVH, bao gồm bất kỳ quyền sở hữu trí tuệ và gây nhầm lẫn cho các quyền
        đó; (aa) sử dụng Dịch vụ để thu thập hoặc lưu trữ dữ liệu cá nhân của
        Người Sử Dụng khác liên quan đến các hành vi và hoạt động bị cấm như đề
        cập ở trên; và/hoặc (ab) liệt kê các hàng hóa xâm phạm quyền tác giả,
        nhãn hiệu hoặc các quyền sở hữu trí tuệ khác của các bên thứ ba hoặc sử
        dụng Dịch Vụ theo các cách thức có thể xâm phạm đến quyền sở hữu trí tuệ
        của các bên khác. <br /> <br /> 4.3 Người Sử Dụng hiểu rằng các Nội
        Dung, dù được đăng công khai hoặc truyền tải riêng tư, là hoàn toàn
        thuộc trách nhiệm của người đã tạo ra Nội Dung đó. Điều đó nghĩa là bạn,
        không phải SVH, phải hoàn toàn chịu trách nhiệm đối với những Nội Dung
        mà bạn tải lên, đăng, gửi thư điện tử, chuyển tải hoặc bằng cách nào
        khác công khai trên Trang SVH. Người Sử Dụng hiểu rằng bằng cách sử dụng
        Trang SVH, bạn có thể gặp phải Nội Dung mà bạn cho là phản cảm, không
        đúng đắn hoặc chưa phù hợp. SVH sẽ không chịu trách nhiệm đối với Nội
        Dung, bao gồm lỗi hoặc thiếu sót liên quan đến Nội Dung, hoặc tổn thất
        hoặc thiệt hại xuất phát từ việc sử dụng, hoặc dựa trên, Nội Dung được
        đăng tải, gửi thư, chuyển tải hoặc bằng cách khác công bố trên Trang
        SVH. <br /> <br /> 4.4 Người Sử Dụng thừa nhận rằng SVH và các bên được
        chỉ định của mình có toàn quyền (nhưng không có nghĩa vụ) sàng lọc, từ
        chối, xóa, dừng, tạm dừng, gỡ bỏ hoặc dời bất kỳ Nội Dung có sẵn trên
        Trang SVH, bao gồm bất kỳ Nội Dung hoặc thông tin nào bạn đã đăng. SVH
        có quyền gỡ bỏ Nội Dung (i) xâm phạm đến Điều Khoản Dịch Vụ; (ii) trong
        trường hợp SVH nhận được khiếu nại hơp lệ theo quy định pháp luật từ
        Người Sử Dụng khác; (iii) trong trường hợp SVH nhận được thông báo hợp
        lệ về vi phạm quyền sở hữu trí tuệ hoặc yêu cầu pháp lý cho việc gỡ bỏ;
        hoặc (iv) những nguyên nhân khác theo quy định pháp luật. SVH có quyền
        chặn các liên lạc (bao gồm việc cập nhật trạng thái, đăng tin, truyền
        tin và/hoặc tán gẫu) về hoặc liên quan đến Dịch Vụ như nỗ lực của chúng
        tôi nhằm bảo vệ Dịch Vụ hoặc Người Sử Dụng của SVH, hoặc bằng cách khác
        thi hành các điều khoản trong Điều Khoản Dịch Vụ này. Người Sử Dụng đồng
        ý rằng mình phải đánh giá, và chịu mọi rủi ro liên quan đến, việc sử
        dụng bất kỳ Nội Dung nào, bao gồm bất kỳ việc dựa vào tính chính xác,
        đầy đủ, hoặc độ hữu dụng của Nội Dung đó. Liên quan đến vấn đề này,
        Người Sử Dụng thừa nhận rằng mình không phải và, trong giới hạn tối đa
        pháp luật cho phép, không cần dựa vào bất kỳ Nội Dung nào được tạo bởi
        SVH hoặc gửi cho SVH, bao gồm các thông tin trên các Diễn Đàn SVH hoặc
        trên các phần khác của Trang SVH. <br /> <br /> 4.5 Người Sử Dụng chấp
        thuận và đồng ý rằng SVH có thể truy cập, duy trì và tiết lộ thông tin
        Tài Khoản của Người Sử Dụng, Nội Dung và bất kỳ tài liệu hoặc thông tin
        nào khác mà Người Sử Dụng cung cấp cho SVH trong trường hợp pháp luật có
        yêu cầu hoặc theo lệnh của tòa án hoặc cơ quan chính phủ hoặc cơ quan
        nhà nước có thẩm quyền yêu cầu SVH hoặc những nguyên nhân khác theo quy
        định pháp luật: (a) tuân thủ các thủ tục pháp luật; (b) thực thi Điều
        Khoản Dịch Vụ; (c) phản hồi các khiếu nại về việc Nội Dung xâm phạm đến
        quyền lợi của bên thứ ba; (d) phản hồi các yêu cầu của Người Sử Dụng
        liên quan đến chăm sóc khách hàng; hoặc (e) bảo vệ các quyền, tài sản
        hoặc an toàn của SVH, Người Sử Dụng và/hoặc cộng đồng.
      </p>
      <h3 className="policy__sub-title">5. VI PHẠM ĐIỀU KHOẢN DỊCH VỤ</h3>
      <p className="policy__content">
        <br />
        Việc vi phạm chính sách này có thể dẫn tới một số hành động, bao gồm bất
        kỳ hoặc tất cả các hành động sau: - Giới hạn quyền sử dụng Tài Khoản; -
        Đình chỉ và chấm dứt Tài Khoản; - Thu hồi tiền/tài sản có được do hành
        vi gian lận, và các chi phí có liên quan như chi phí vận chuyển của đơn
        hàng, phí thanh toán…; - Cáo buộc hình sự; - Áp dụng biện pháp dân sự,
        bao gồm khiếu nại bồi thường thiệt hại và/hoặc áp dụng biện pháp khẩn
        cấp tạm thời; - Các hành động hoặc biện pháp chế tài khác theo Tiêu
        Chuẩn Cộng Đồng, Quy Chế Hoạt Động, hoặc các Chính Sách SVH.
      </p>
      <h3 className="policy__sub-title">6. ĐẶT HÀNG VÀ THANH TOÁN</h3>
      <p className="policy__content">
        <br />
        6.1 Vào từng thời điểm, SVH hỗ trợ một hoặc nhiều phương thức thanh toán
        như sau:
        <br />
        <br />
        (i) Thanh Toán Khi Nhận Hàng (COD) SVH cung cấp dịch vụ COD ở TP.HCM.
        Người Mua có thể trả tiền mặt trực tiếp cho người vận chuyển vào thời
        điểm nhận hàng.
        <br />
        <br />
        (vi) VN Pay Hình thức thanh toán bằng VN Pay áp dụng cho Người Mua có
        liên kết và lựa chọn VN Pay làm phương thức thanh toán khi mua hàng.
        <br />
        <br />
        6.2 Người Mua chỉ có thể thay đổi kênh thanh toán trước khi thực hiện
        thanh toán.
        <br />
        <br />
        6.3 Người Mua chỉ có thể đặt tối đa {limitOfOrders} đơn hàng chờ xác
        nhận cùng 1 thời điểm.
        <br />
        <br />
        6.4 SVH không chịu trách nhiệm cũng như nghĩa vụ nào đối với bất kỳ tổn
        thất hoặc thiệt hại nào mà Người Mua hoặc Người Bán phải chịu từ việc
        nhập sai thông tin vận chuyển và/hoặc thông tin thanh toán cho đơn hàng
        đã đặt và/hoặc sử dụng phương thức thanh toán không được liệt kê ở khoản
        6.1 ở trên. SVH bảo lưu quyền kiểm tra tính hợp pháp quyền sử dụng
        phương thức thanh toán của Người Mua và có quyền đình chỉ giao dịch cho
        đến khi xác nhận được tính hợp pháp hoặc hủy các giao dịch liên quan nếu
        không thể xác nhận tính hợp pháp này. Lưu ý: SVH sẽ chịu trách nhiệm với
        những đơn hàng có sử dụng các dịch vụ hỗ trợ chuyển phát của SVH.
      </p>
      <h3 className="policy__sub-title">7. HỦY ĐƠN HÀNG</h3>
      <p className="policy__content">
        <br />
        7.1 Người Mua chỉ có thể hủy đơn hàng trong vòng{" "}
        {timeAllowedForOrderCancellation} giờ kể từ khi đặt hàng
        <br />
        <br />
        7.2 Nếu bạn dùng VN Pay để thanh toán trả trước và hủy đơn hàng, SVH sẽ
        hoàn trả số tiền bạn đã thanh toán cho đơn hàng đó .
      </p>
    </div>
  );
};

export default TermOfService;
