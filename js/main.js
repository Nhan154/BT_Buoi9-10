// Employee Constructor
function NhanVien(taiKhoan,hoTen,email,matKhau,ngayLam,luongCoBan,chucVu,gioLam) {
    this.taiKhoan = taiKhoan;
    this.hoTen = hoTen;
    this.email = email;
    this.matKhau = matKhau;
    this.ngayLam = ngayLam;
    this.luongCoBan = luongCoBan;
    this.chucVu = chucVu;
    this.gioLam = gioLam;
    this.tongLuong = this.tinhTongLuong();
    this.loaiNV = this.xepLoaiNV();
  }
  
  
  NhanVien.prototype.tinhTongLuong = function() {
    switch (this.chucVu) {
      case "Sếp": return this.luongCoBan * 3;
      case "Trưởng phòng": return this.luongCoBan * 2;
      case "Nhân viên": return this.luongCoBan;
      default: return 0;
    }
  };
  
  NhanVien.prototype.xepLoaiNV = function() {
    if (this.gioLam >= 192) return "Xuất sắc";
    if (this.gioLam >= 176) return "Giỏi";
    if (this.gioLam >= 160) return "Khá";
    return "Trung bình";
  };
  
  
  const employeeManager = {
    danhSachNV: [],
  
    init: function() {
      this.setupDatepicker();
      this.setupEventListeners();
      this.loadFromLocalStorage();
      this.renderTable();
    },
  
    setupDatepicker: function() {
      $("#datepicker").datepicker({
        dateFormat: "mm/dd/yy",
      });
    },
  
    setupEventListeners: function() {
      $("#sidebarCollapse").on("click", () => {
        $("#sidebar").toggleClass("active");
      });
  
      $("#btnThem").click(() => {
        $("#header-title").text("Thêm nhân viên");
        $("#btnThemNV").show();
        $("#btnCapNhat").hide();
        this.resetForm();
      });
  
      
      $("#btnThemNV").click(() => {
        if (this.validateForm()) {
          const nv = this.getEmployeeFromForm();
          this.danhSachNV.push(nv);
          this.saveToLocalStorage();
          this.renderTable();
          $("#myModal").modal("hide");
        }
      });
  
      $("#btnCapNhat").click(() => {
        if (this.validateForm()) {
          const nv = this.getEmployeeFromForm();
          const index = this.danhSachNV.findIndex(
            item => item.taiKhoan === $("#tknv").attr("data-old")
          );
          if (index !== -1) {
            this.danhSachNV[index] = nv;
            this.saveToLocalStorage();
            this.renderTable();
            $("#myModal").modal("hide");
          }
        }
      });
  
      $("#btnTimNV").click(() => {
        const searchTerm = $("#searchName").val().toLowerCase();
        if (searchTerm) {
          const filtered = this.danhSachNV.filter(nv =>
            nv.loaiNV.toLowerCase().includes(searchTerm)
          );
          this.renderTable(filtered);
        } else {
          this.renderTable();
        }
      });
  
      $("#SapXepTang").click(() => {
        this.danhSachNV.sort((a, b) => a.taiKhoan.localeCompare(b.taiKhoan));
        this.renderTable();
      });
  
      $("#SapXepGiam").click(() => {
        this.danhSachNV.sort((a, b) => b.taiKhoan.localeCompare(a.taiKhoan));
        this.renderTable();
      });
    },
  
    getEmployeeFromForm: function() {
      return new NhanVien(
        $("#tknv").val(),
        $("#name").val(),
        $("#email").val(),
        $("#password").val(),
        $("#datepicker").val(),
        parseFloat($("#luongCB").val()),
        $("#chucvu").val(),
        parseFloat($("#gioLam").val())
      );
    },
  
    renderTable: function(data) {
      const tableBody = $("#tableDanhSach");
      tableBody.empty();
  
      const employees = data || this.danhSachNV;
      
      employees.forEach(nv => {
        const row = `
          <tr>
            <td>${nv.taiKhoan}</td>
            <td>${nv.hoTen}</td>
            <td>${nv.email}</td>
            <td>${nv.ngayLam}</td>
            <td>${nv.chucVu}</td>
            <td>${nv.tongLuong.toLocaleString()}</td>
            <td>${nv.loaiNV}</td>
            <td>
              <button class="btn btn-primary btn-sm edit-btn" data-id="${nv.taiKhoan}">Sửa</button>
              <button class="btn btn-danger btn-sm delete-btn" data-id="${nv.taiKhoan}">Xóa</button>
            </td>
          </tr>
        `;
        tableBody.append(row);
      });
  
      $(".edit-btn").click((e) => {
        const taiKhoan = $(e.target).data("id");
        this.editEmployee(taiKhoan);
      });
  
      $(".delete-btn").click((e) => {
        const taiKhoan = $(e.target).data("id");
        this.deleteEmployee(taiKhoan);
      });
    },
  
    editEmployee: function(taiKhoan) {
      const nv = this.danhSachNV.find(item => item.taiKhoan === taiKhoan);
      if (nv) {
        $("#header-title").text("Cập nhật nhân viên");
        $("#btnThemNV").hide();
        $("#btnCapNhat").show();
        
        $("#tknv").val(nv.taiKhoan).attr("data-old", nv.taiKhoan);
        $("#name").val(nv.hoTen);
        $("#email").val(nv.email);
        $("#password").val(nv.matKhau);
        $("#datepicker").val(nv.ngayLam);
        $("#luongCB").val(nv.luongCoBan);
        $("#chucvu").val(nv.chucVu);
        $("#gioLam").val(nv.gioLam);
        
        $("#myModal").modal("show");
      }
    },
  
    deleteEmployee: function(taiKhoan) {
      if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
        this.danhSachNV = this.danhSachNV.filter(item => item.taiKhoan !== taiKhoan);
        this.saveToLocalStorage();
        this.renderTable();
      }
    },
  
    resetForm: function() {
      $("#tknv").val("").removeAttr("data-old");
      $("#name").val("");
      $("#email").val("");
      $("#password").val("");
      $("#datepicker").val("");
      $("#luongCB").val("");
      $("#chucvu").val("Chọn chức vụ");
      $("#gioLam").val("");
      $(".sp-thongbao").text("");
    },
  
    validateForm: function() {
      let isValid = true;
      const taiKhoan = $("#tknv").val();
      const hoTen = $("#name").val();
      const email = $("#email").val();
      const matKhau = $("#password").val();
      const ngayLam = $("#datepicker").val();
      const luongCB = $("#luongCB").val();
      const chucVu = $("#chucvu").val();
      const gioLam = $("#gioLam").val();
  
      
      $(".sp-thongbao").text("");
  
      
      if (!taiKhoan) {
        $("#tbTKNV").text("Tài khoản không được để trống").css("color", "red");
        isValid = false;
      } else if (!/^\d{4,6}$/.test(taiKhoan)) {
        $("#tbTKNV").text("Tài khoản phải có 4-6 ký số").css("color", "red");
        isValid = false;
      }
  
      if (!hoTen) {
        $("#tbTen").text("Họ tên không được để trống").css("color", "red");
        isValid = false;
      } else if (!/^[a-zA-Z\sÀ-ỹ]+$/.test(hoTen)) {
        $("#tbTen").text("Họ tên chỉ được chứa chữ cái").css("color", "red");
        isValid = false;
      }
  
      if (!email) {
        $("#tbEmail").text("Email không được để trống").css("color", "red");
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        $("#tbEmail").text("Email không đúng định dạng").css("color", "red");
        isValid = false;
      }
  
      if (!matKhau) {
        $("#tbMatKhau").text("Mật khẩu không được để trống").css("color", "red");
        isValid = false;
      } else if (!/^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,10}$/.test(matKhau)) {
        $("#tbMatKhau")
          .text("Mật khẩu 6-10 ký tự, có ít nhất 1 số, 1 hoa, 1 đặc biệt")
          .css("color", "red");
        isValid = false;
      }
  
      if (!ngayLam) {
        $("#tbNgay").text("Ngày làm không được để trống").css("color", "red");
        isValid = false;
      } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(ngayLam)) {
        $("#tbNgay").text("Ngày làm phải đúng định dạng mm/dd/yyyy").css("color", "red");
        isValid = false;
      }
  
      if (!luongCB) {
        $("#tbLuongCB").text("Lương cơ bản không được để trống").css("color", "red");
        isValid = false;
      } else if (isNaN(luongCB) || luongCB < 1000000 || luongCB > 20000000) {
        $("#tbLuongCB")
          .text("Lương cơ bản phải từ 1,000,000 đến 20,000,000")
          .css("color", "red");
        isValid = false;
      }
  
      if (!chucVu || chucVu === "Chọn chức vụ") {
        $("#tbChucVu").text("Vui lòng chọn chức vụ").css("color", "red");
        isValid = false;
      }
  
      if (!gioLam) {
        $("#tbGiolam").text("Giờ làm không được để trống").css("color", "red");
        isValid = false;
      } else if (isNaN(gioLam) || gioLam < 80 || gioLam > 200) {
        $("#tbGiolam")
          .text("Giờ làm phải từ 80 đến 200 giờ")
          .css("color", "red");
        isValid = false;
      }
  
      return isValid;
    },
  
    saveToLocalStorage: function() {
      localStorage.setItem("danhSachNV", JSON.stringify(this.danhSachNV));
    },
  
    loadFromLocalStorage: function() {
      const data = localStorage.getItem("danhSachNV");
      if (data) {
        this.danhSachNV = JSON.parse(data);
      }
    }
  };
  
  
  
  $(document).ready(function() {
    employeeManager.init();
  });