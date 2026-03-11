import { Input } from './components/shared/Input'
import { Search, Mail } from 'lucide-react'
import { Card } from './components/shared/Card'
import { Button } from './components/shared/Button'
import { useNavigate } from 'react-router-dom'
import { Plus, Download } from 'lucide-react'


function App() {
  const navigate = useNavigate()

  return (
    <>
      <Input label="Email" type="email" placeholder="ban@email.com" />

      <Input
        label="Mật khẩu"
        type="password"
        error="Mật khẩu phải có ít nhất 8 ký tự"
      />

      <Input
        label="Số tiền"
        type="number"
        helperText="Nhập số tiền bằng VND, ví dụ: 45000"
      />

      <Input label="Tên" required />

      <Input
        label="Tìm kiếm"
        leftIcon={<Search size={16} />}
        placeholder="Tìm giao dịch..."
      />
      <Input
        label="Email"
        leftIcon={<Mail size={16} />}
        type="email"
      />

      <Card>
        <h2>Tổng chi tiêu tháng này</h2>
        <p>2.450.000 ₫</p>
      </Card>

      {/* // Elevated — nổi bật hơn, thường dùng cho modal hoặc hero section */}
      <Card variant="elevated">
        <h2>Chào mừng trở lại!</h2>
      </Card>

      {/* // Locked — Free user cố truy cập tính năng Plus */}

      {/* 👇 Bỏ <Router> wrapper này đi — không cần nữa */}
      <Card
        variant="locked"
        requiredPlan="PLUS"
        onUpgrade={() => navigate('/pricing')}
      >
        haha
      </Card>

      <Card
        variant="locked"
        requiredPlan="PREMIUM"
        onUpgrade={() => navigate('/pricing')}
      >
        haha
      </Card>


      {/* // Locked với Premium */}
      <Card
        variant="locked"
        requiredPlan="PREMIUM"
        onUpgrade={() => navigate('/pricing')}
      >
        haha
        {/* <HouseholdSummary /> */}
      </Card>
      {/* // Cơ bản */}
      <Button>Lưu</Button>

      {/* // Các variants */}
      <Button variant="primary">Thêm giao dịch</Button>
      <Button variant="ghost">Hủy</Button>
      <Button variant="danger">Xóa</Button>
      <Button variant="premium">💎 Nâng cấp Premium</Button>

      {/* // Kích thước */}
      <Button size="sm">Nhỏ</Button>
      <Button size="lg">Lớn</Button>

      {/* // Trạng thái loading */}
      <Button loading>Đang lưu...</Button>

      {/* // Có icon */}
      <Button leftIcon={<Plus size={16} />}>Thêm mới</Button>
      <Button rightIcon={<Download size={16} />} variant="ghost">Xuất CSV</Button>

      {/* // Disabled */}
      <Button disabled>Không khả dụng</Button>
    </>
  )
}

export default App;
