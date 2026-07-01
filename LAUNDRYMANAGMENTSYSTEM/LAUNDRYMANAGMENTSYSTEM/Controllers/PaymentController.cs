using LAUNDRYMANAGMENTSYSTEM.Data;
using LAUNDRYMANAGMENTSYSTEM.Model;
using Microsoft.AspNetCore.Mvc;

namespace LAUNDRYMANAGMENTSYSTEM.Controllers
{
    [Route("api/payments")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private PaymentData _paymentData = new PaymentData();

        // ==================== GET ALL ====================
        // GET: api/payment
        [HttpGet]
        public IActionResult GetAll()
        {
            var payments = _paymentData.GetAll();
            return Ok(payments);
        }

        // ==================== GET BY ID ====================
        // GET: api/payment/1
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var payment = _paymentData.GetById(id);
            if (payment == null)
                return NotFound($"Payment with ID {id} not found.");
            return Ok(payment);
        }

        // ==================== INSERT ====================
        // POST: api/payment
        [HttpPost]
        public IActionResult Create([FromBody] PaymentModel payment)
        {
            if (payment.OrderId <= 0)
                return BadRequest("OrderId is required.");
            if (payment.Amount <= 0)
                return BadRequest("Amount must be greater than 0.");
            if (string.IsNullOrEmpty(payment.PaymentMethod))
                return BadRequest("PaymentMethod is required.");

            _paymentData.Insert(payment);
            return CreatedAtAction(nameof(GetById), new { id = payment.PaymentId }, payment);
        }

        // ==================== UPDATE ====================
        // PUT: api/payment/1
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] PaymentModel payment)
        {
            if (id != payment.PaymentId)
                return BadRequest("ID mismatch.");

            var existing = _paymentData.GetById(id);
            if (existing == null)
                return NotFound($"Payment with ID {id} not found.");

            _paymentData.Update(payment);
            return Ok(payment);
        }

        // ==================== DELETE ====================
        // DELETE: api/payment/1
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var existing = _paymentData.GetById(id);
            if (existing == null)
                return NotFound($"Payment with ID {id} not found.");

            _paymentData.Delete(id);
            return NoContent();
        }

       
    }
}