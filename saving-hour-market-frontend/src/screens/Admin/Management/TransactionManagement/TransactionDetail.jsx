import React from "react";
import "./TransactionDetail.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const TransactionDetail = ({ handleClose }) => {
  return (
    <div
      style={{ width: "max-content" }}
      className={`modal__container modal-scroll`}
    >
      {/* // modal header */}
      <div className="modal__container-header">
        <h3 className="modal__container-header-title">Chi tiết giao dịch</h3>
        <FontAwesomeIcon onClick={handleClose} icon={faXmark} />
      </div>
      {/* ****************** */}
      <div className={`modal__container-body `}>
        <div className="transaction__information">
          <h2 className="transaction__information-title">
            Thông tin giao dịch
          </h2>
          <div className="transaction__information-body">
            <div className="transaction__information-body-item">
              <h3 className="transaction__information-body-item-title">
                Thời điểm giao dịch
              </h3>
              <h3 className="transaction__information-body-item-desc">
                05-05-2023 07:00AM
              </h3>
            </div>
            <div className="transaction__information-body-item">
              <h3 className="transaction__information-body-item-title">
                Phương thức thanh toán
              </h3>
              <h3 className="transaction__information-body-item-desc">
                VN Pay
              </h3>
            </div>
            <div className="transaction__information-body-item">
              <h3 className="transaction__information-body-item-title">
                Trạng thái thanh toán
              </h3>
              <h3 className="transaction__information-body-item-desc">
                Đã hủy
              </h3>
            </div>
          </div>
        </div>
        <div className="order__information">
          <h2 className="order__information-title">Thông tin đơn hàng</h2>
          <div className="order__information-body">
            <div className="order__information-body-item">
              <h3 className="order__information-body-item-title">
                Tên khách hàng :
              </h3>
              <h3 className="order__information-body-item-desc">Hà Anh Tú </h3>
            </div>
            <div className="order__information-body-item">
              <h3 className="order__information-body-item-title">
                Số điện thoại :
              </h3>
              <h3 className="order__information-body-item-desc">0898449505</h3>
            </div>
            <div className="order__information-body-item">
              <h3 className="order__information-body-item-title">
                Địa chỉ giao hàng :
              </h3>
              <h3 className="order__information-body-item-desc">
                121 Trần Văn Dư,phường 13, Quận Tân Bình, TP.HCM
              </h3>
            </div>
          </div>
        </div>
        <div className="table__container">
          {/* data table */}
          <table class="table ">
            <>
              <thead>
                <tr className="table-header-row">
                  <th>No.</th>
                  <th>Hình ảnh</th>
                  <th>Tên</th>
                  <th>Số lượng</th>
                  <th>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr className="table-body-row">
                  <td style={{ paddingTop: "30px" }}>1</td>
                  <td>
                    <img
                      width="80px"
                      height="60px"
                      src="data:image/jpeg;base64,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"
                    />
                  </td>

                  <td style={{ paddingTop: "30px" }}>Chuối to chín vàng</td>
                  <td style={{ paddingTop: "30px" }}>x3</td>
                  <td style={{ paddingTop: "30px" }}>300.000đ</td>
                </tr>{" "}
                <tr className="table-body-row">
                  <td style={{ paddingTop: "30px" }}>1</td>
                  <td>
                    <img
                      width="80px"
                      height="60px"
                      src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJEAoAMBEQACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAEAQIDBQYAB//EADgQAAEDAgQDBgQEBQUAAAAAAAEAAgMEEQUSITEGQVETImFxgZEjMkKhFFJiwTNTsdHwJDRDcvH/xAAaAQACAwEBAAAAAAAAAAAAAAABBAACAwUG/8QAMhEAAgIBAwMDAQYFBQAAAAAAAAECAxEEITEFEkETIlFxBhQykbHRYYGh4fAVFiMzUv/aAAwDAQACEQMRAD8A3mZMieTs6hMiFygBC4qEEz6KYAJmsjgmRMymCZOLkQDcygBMyhBpcoAQuRAxpcoTI26ICNx1RRVkRKJRsYXIgyROejgo5EZddFIpkjeVYDNHmSuDpHXQwQ4uRwTIPVVIhAA1e75Qs7bI1xyzWmp2ywgE1k5z9jM1zwbEyNs30SK1k2zovQ14BafiOLtDDOC8tNnSRDuhbLW1ppWbZFLdL2v2PJdteHNDmm4IuD1TokcSoQS6gDlCCFEAh2UIyNyIDidFAEZKJVkbtkSpC4IlGROVzNjCFADCiU3NDmSx0zrqEydfVQhmsZmlkD5Gydm7P3QHbMBtf31XH1lzd3b8Hb0VajSpfJ59NjuKYhIYp53GEEtAYMpePFCXbFZRnO6TeCejkqI2vijgklkt3Y4mklreZsOQSs4d8srgouDfcO8Qw11NFHO7JLlFnk6FdCjXxXss/MTnQ28xNTHR54w9srDfUWF/umfvcCLTSxyMdSytFwA/yWsb4S4KSonEgIINjv0Wpi00NKIBCoAY7dEAwogGFQqxhCJUYQiBkZCJRkZF1YqIWaKA7S5usB466gRQVMEMPxV2uFzyVL5M0MhdlYzkQFwLHGdr+Tv1XJUqP8DEtrY6dzSyJ1yO7mbbVR1SktxPzkM4ZxGahx8VIk+Ix+Z36gd7e6pesVZh4An7jcY9RUdWBVYexkFa/vGNmjJ+d7cnLkx1fqbTjuPOnMe6JX4PxHXUk4hL3Fo0DHnQdRZMKcqo5izDzhm6osdgmt2hMRPt7o1dRjxNYNXW8bFl8OdlzlcDsRv7rq06p4zF5F50xls0CzUjhrF3h05roV6qMtnsI2aWUd48ArhY2O6aW4qRlEA0ogGFQqIQUQDS1QA0sRyV7RMllCYELUcgwHrIZFUCham1HD2s9g4/JHzJXO1muhTHtTyxmrTye7MHQsPEPGTYJnH8NTNdJK0n5iOXuR6LlP8A6t+WO1RbkVvHtCWYo6UfJ2mvloEdHNKtw+CXrE8/JS4kHQzUdXGwttGGH9VidfZGp96lBhkvYmbCipTitDG1s/ZPbZ0UoFxbldciVkabH3LbyM6ex4wVlcJqWubS4wwQ1Lr9nUD5Jh1BTfp+zvq3j8F5RUn/ABLakmMLgyU2vtfmudbDuWUWjtszRYbWS0/8N92E/KVjXqbKJZRZ1qXJoqStjqBbZ3MFd3S62u7Z7MwnU48BE1PHOLuFjbcLrV3ShwK2UwnyVtRRSRd5ozN6gbJ6vURntwc+zTyhxugQgrdMWwcGo5Jg7KpkmDsqmQYOLQoTA0sRBgaWKAwTgqpqG0EYN5Da4NhdI6u1r2LyO6SpSzJg+MCJsEkxF3MYSLnoF5zVKKkdJJtHleFNqcEq58WkeXkscHMaN826tZar4qqOxrVV2PLNRjGE1FZTBs8dppIy8t5tcdbH0S9cnTJRZhfFTexX0mER1dGaepZuMzL8nW2WNmpcJ90WXqimnGRJw0Pwjn0Uts8X8Mnm3oqa6XqJWLySuDg8M0ddQ0mL0LqWui7SI66GxaeoPI/4VlpNTOl7DTSa3MRU0+IcKzNirAazDHm0UwFiPA9D4ey60oVaqPfXtIqttpbmlwmpgqomyUkgc3pfULiaiqdbxNGyjhbF5SuDvBSnGQMsoZ3x2106Lq1aiyHnYxlBMNhqWSaHQrp1amMxeVbQ2ejjm7zbNd1H7roVahx/ihO3TRluuQCWmfEe+NORGxT0bIz4EJ1ShyMyBXKYEyqEwJkUBgTJ4I5IJlUyDAgCgQ+mNqf1K5OseJM6ukx2IqOIX/6Ii/zGy87rHujp1LcqMEpo5sVpIngEC8ljzyi4+9lnpYuVhpb7YNmwmgaW3tdx3XRuoWMiXJRS0rGSPYANTdefu9smjaETJTMlpMbMUrviaviedM7enmNk+u2dHcuPP1L4yzUUcpkaHt0adweS5mO2WDRLYPkghqoH09RG2WF4s5juafok4boqzE4nw5V4HUmqwyR7qcm4P5fB3909OcLY4mi8McItcJxxri2OvYYZNg/6SudPT9rzDdGjjk08Dw5gc03b1WtcsrYxksBLQDqEzHfgzCoXlmh1CeptlHZmU4phByPHnyT0Jp7xF5R8MFmpBe8Wh6HZOV6nxIUs0vmIGWlpIIsRyTaafAm01ycoAREg0jooAjCgEEQu+E5vMG652vi8dyOjopeCox4F1K63I7LzGqOxUVHDzyzH6MuOjmyM9S0n9lbRyUZF7t4M2cjzdO2WPIvGIDUR5nhwXI1NHdPuRrEpeJcIfW0jZKcZaqE54nePQ+BVqJejL3fhfIfoC4DWCena+zmn5ZGO3a4bhLaqr054NMJrJpYLEAtNwtqmmsmbCmsDm2cA5p0II0ITsYlMlFifDsT3dpAy7Buwbt8uo8FjZXOCcqzeFudmDU0VZQOzUz8zP5bjcFKKbznGGavtlyXFBicM7uzkJil/K/n5HmmqrV5MZ1NcFq0kBOxbMGiRrit1Io4kzZdO8mYW/wDoylD4EnhbMNRc9QmoWyhvHgwsqjPZgE0T4ztdvUJ+u2Ni2OfZTKt7kRC0MjrIkIQUSo+J2V3gdFjfX31tG1E+yaYLiMXaRvZ1C8hq62so9BVLgzbM1NNHM0d6J4cPRJVW9skxpruWDZl7Xta9jrtcLg9V07uVJeRSPwdYFZbMsP7MPb6KOtSRM4MtjmHyYXUuxWkYXQn/AHUbR6Zxb7+GvIrKVPfH0pcrj9jSM0t2WeH1LHxtcx2aN21khXmuWC84ltEbi/JdOt5Rg9ghgCaismbIp6NkhLmWa479CsrNLGe8dmXjY1syvnw6KS7JGZXcjbfySb0++HszeNvwCOlrsIcCQamkH0k99nkeYRjKdWz/AM/Ys1Gz6lvQ1sFbEJIHA3+k7hNV3Rn9ReUWtgxp6plSMxzSR8hWkZuPBVpPkcXMk7jhY9Oq3VnlbMzcPD4AJo8hJaNF0NNqfU9r5OdqKPT90eCG+qcFSAlEqJmsoQ6V2dn2K4HU9P2vuXDOxoru6Pa+UVFVT2kcbaFeWsThI68XlB2DTnsjTPOrBdniOn+dU/pbVOPY+TG2OH3Is2nktE8bFSeI2NjstoPcq0SuYHBaSrTQFLBjsVoJeHJXV1DG5+GHWaFguaf9TRzb1A28tl7tP6vG0v1NYWY2fBcYXiMVTC2WnkbIxwBBB0KTrnKuXbLk0nDyXEb2u1HsulXNS4FmmiUJhFRxYHts4XCMoKSwwKTT2B6inIYe6ZGdOaVupko7LJpGeTNTUstPUPfSgtDtmgWIIWHTLK1c4XLZmGtdkq+6t7oJw/HwQGVXL6wP6hdrU9Msr91XuXx5/uIaXqtdntt2f9P7F1HO2RueN4c3wXM9Q63aK+UEa2KErQqJF2/a3a43spTq/fzuitlSccA7jlcQvV1TVkFNeTz9kXCTi/BAtTMaoAcw29rLK2qNkXFmldjrl3IhnjBBC8frtI624s9DReprKBA0xSB7TZwNwuVFyhLK5G9mi1inEjQ+1uo6FdP1FOPchftcXgJY4OG6spZIFwPzNsd01VPKwZyWCQsBvpdauCfJTOGZKv4Xmw+ofW8OkMLyXSUTj8N55lp+k/ZL30qxe78/JvXbjYJwrF2TudDI10NQw/Eifo5qQi5VSxL8zeUFJbF9DNmGtk/Xb8i0ofASzzTcWYskAC1STKENRStma4fI4g99trhY26aFm7W5eM3E87quH8WwQTyVNR+Ops5cyZrbFjejh766+i7mhvg4+m9mea6vp7Iz9aEdvItFiUkTg+N5af6rTVdOp1G7WH8r/P1FtH1W2jZPK+GXLMabKzvss7nlK8/quh6mO9bUv6P9j0NHWqJ/jXaRPxONpL3HKALi4XDt6fra2nKtnThrNNZtGaIMDxapxOWqlkjLaUECncWgdoOZHMjxXsem0WU6dKzk4mvtrnZ7C5T4qNKgGICpgmTnm7UrqtNHUQw+TejUSpllcA5tfVeO1mknVLEluegovjYsoljBBu3/ANS1UpQeTaSUkExy2OqZ7se5cGa+GGRyA2LTqt4T8oDQZFKHaHdOV2p7MylHBMRdb7MzK/E8JpsRAMzS2Vg7krNHt9f2WFunjYsM1ha4cFS/8fhIJqmmoph/zxjVo/UOXoudKi2p+3dDKnCf1LOjrYpmh8D2uB2sbrWnUbmc6/kPjmB0OifhcmYSgTBy2UjPAhsRsg8BwZDiLhwDNWYYwNO8kLR92/2XU0Wvw+y1/RnA6l0nuzdp1v5X7Gajl01K7GDzsZvhk2ct13Qwa9zSyE0tf38rtFWVZrVqd8GiKWOwxpUAcAoRHO2RCCTuLflF/NLajTQvj2yDVqZ0SzEdT1bSNCDbQjovJ6zQWaeW62PQaXV13xzF7hPdeLsOvgkoywNtZFjnLHWKtxvEGfDDopQ4LeFqfIGgqKctNtwmq7nH6GUoZC2SNkGidjZGRi4tC5VZpFclNiGAskc6bD5TRVN73a27Hn9Tf3Filp6aqT9yNVZJcMq5MWqsJkbFjlP2TXGzamMkwuP/AG+k+DreqXlpbo71+5f1/Lz/ACLfeIZxZ7f0/MtabEGvYHxvDmb7rGGqcXhm0qk1sFx18Em0jQehNkzHV1y8mTqaJi+40PsVq57bFcYMbxbRU9PKyqjLY3yOyuj5OdqbjxXX6Vr3OfoT/kec6102PY9TXt8lPCc4sfuu89jz1bcthJInA3aomVnW08o1ySPRjVADgoQa5QjBphdEykVNTFIx3aQOyuHsfNWnXC2PZNZQr32Uy9Sp4Y6jxZokEcvwpf1bHyK8zruiyr99W6PQ6HrELl22bMuGyslbZ+niuE1KDwztJxkMdO+mcM7u7ycNkPxPbZk3iH01W1wGv3V1Y4vEiYyGMlHJyZjb8Mq4hDapw0OoTMNS1szN1JhEcrJBodUxCyMzNxaGVMMVRA+GaNskUgyuY8XBHiFZ5XAMJrDWx55xBg1bw481eETSHDydYyc3ZE/t4puuGn1v/HdFd3ytmczUfeNH76Ze345wVR4gqpG2e0ZuoWU/s3XnMJ/mCv7QPHviSwcS4xGLRzNLej7lFdBmuLAy+0FXmH6EdRW4litVFJiE0XZQ3MccTSLuOl3Hy5Lp9O6Z91k5t5Zyup9YWpq9KCwmWVLDoF05SOXTXsGdiCNlnka7MoubrE6GTkCM4KEEdsiBkLxdQqwd7BrorIykiursOjqGWLdeq0UhadOd1sypFXiOESZTeoh/I86geB/ukdX02rULK5G9L1O2h9thZUmP0eIRmMPyOt3onizvbn6LzGq6RbW/aemo6hXYgY1ktERJRSh0XOMm7fTollCz8NsRrvhLeLLbDeJKaocGF/Zyfkfpc+B2Kynppw3jugxsi+S9irGOAubXWauxsy+MhAmAFw4LVXJboDXgcMQMf8TVvVaR1rj+IHop8Ezpqephcx+V0bgQ5rhoQUxHUwl7k+DKdW2GjyzGaSnosUnp6SUSRsII1uWX+k+K9doNS9RSptYPGdS0v3W5xXHgHY0p5HNcgyn+YXVjF8l7S6tFkvI6VW62LFjLjZUyNqJM1yoaJj7qBFBUINcVCDeSgCNzbolWhjm2RyBoDqqZkzLOGbzV4sXtqUjM4ngQfchniCBqFdqM1uLRnZS9uColZiVKCIqhz2dHgO/rqlLNDXLdo6NPUnxkCfX1jQ5r449dD3Eq+n1J5wx1a6T8kmH45itCbQ1BMf8AKfq306eizt6Zp7ViUf5mkOoWw4ZfU/G0pZlnozmHNkm65Nn2dWcwn+Y7DrCX4ohB4rEoFu1YemhWP+37s8pm3+safzkireI62SmLKCod2p+p7ALeq2p+z0u/M8Y+rF7us049qYDRRyCBomkMkm7nnmV6yipVQUUeV1upd9rmw5jNEyc9smbG7oVMorhstKAuYQHahZTwx7TNx5LuneCEuzpweRAiRDwUCw8FAJ1rqAOUINsoQY9qIGhhZdTJXtGujHRHJXtAarDIp7mwaeoWisaF56ZS42ZSVuBubc5cw6gK6lGQs4W1lRLhjbnuKOBI6l8AzqHLsLIdhqr8nCAt8lEguzJIxlijgo5B1OFdCsyypGBxUlwVrim9y0jgFtlm5D8a0StisqtmihgJhu3ZUZrDYmaUMGiHtQLIeNEAnXUIKOqhDioQ6yhDsqgRezUDgQxhQGBjo2nSygGkwKpw+KUG7QD4BXU2hezTwmU9VhTmC7O8FtGxPkQs004bxK2WksbEWKvgX7pLkh/DWOymC3qEjIy3kikVcshVO4seNN0WVjLtkXdO64S7OpXLYJa26qbpEjRZQKQ9qDLIlaqlkOQCcoQUbKEFUIOCgThugFD+ShbwMcoUYwokGu5qABpvlUXJnLgqK/f1TUDlagrnLQVQhURGPj+YIsi5Lem2S8jpVcB8eyoxtDkAn//Z"
                    />
                  </td>

                  <td style={{ paddingTop: "30px" }}>Chuối to chín vàng</td>
                  <td style={{ paddingTop: "30px" }}>x3</td>
                  <td style={{ paddingTop: "30px" }}>300.000đ</td>
                </tr>{" "}
                <tr className="table-body-row">
                  <td style={{ paddingTop: "30px" }}>1</td>
                  <td>
                    <img
                      width="80px"
                      height="60px"
                      src="data:image/jpeg;base64,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"
                    />
                  </td>

                  <td style={{ paddingTop: "30px" }}>Chuối to chín vàng</td>
                  <td style={{ paddingTop: "30px" }}>x3</td>
                  <td style={{ paddingTop: "30px" }}>300.000đ</td>
                </tr>
              </tbody>
            </>
          </table>
        </div>
      </div>
      {/* modal footer */}
      <div className="modal__container-footer">
        <div className="modal__container-footer-buttons">
          <button
            onClick={handleClose}
            className="modal__container-footer-buttons-close"
          >
            Đóng
          </button>
        </div>
      </div>
      {/* *********************** */}
    </div>
  );
};

export default TransactionDetail;
