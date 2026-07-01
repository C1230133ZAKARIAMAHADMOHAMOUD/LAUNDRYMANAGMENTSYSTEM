namespace LAUNDRYMANAGMENTSYSTEM.Model
{
    public class OrderModel
    {
        public int OrderId { get; set; }
        public int CustomerId { get; set; }
        public int ServiceId { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Statuss { get; set; }
    }
}
