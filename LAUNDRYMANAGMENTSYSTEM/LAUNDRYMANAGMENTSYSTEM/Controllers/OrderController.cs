using LAUNDRYMANAGMENTSYSTEM.Data;
using LAUNDRYMANAGMENTSYSTEM.Model;
using Microsoft.AspNetCore.Mvc;

namespace LAUNDRYMANAGMENTSYSTEM.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private OrderData _orderData = new OrderData();

        [HttpGet]
        public IActionResult GetAll()
        {
            var orders = _orderData.GetAll();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var order = _orderData.GetById(id);
            if (order == null) return NotFound($"Order {id} not found.");
            return Ok(order);
        }

        [HttpPost]
        public IActionResult Create([FromBody] OrderModel order)
        {
            if (order.CustomerId <= 0) return BadRequest("CustomerId required.");
            if (order.ServiceId <= 0) return BadRequest("ServiceId required.");
            _orderData.Insert(order);
            return Ok("Order inserted successfully");
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] OrderModel order)
        {
            if (id != order.OrderId) return BadRequest("ID mismatch.");
            _orderData.Update(order);
            return Ok(order);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _orderData.Delete(id);
            return NoContent();
        }
    }
}