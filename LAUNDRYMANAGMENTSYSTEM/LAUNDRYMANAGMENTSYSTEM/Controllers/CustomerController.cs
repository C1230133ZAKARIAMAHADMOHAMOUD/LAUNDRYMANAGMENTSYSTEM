using LAUNDRYMANAGMENTSYSTEM.Data;
using LAUNDRYMANAGMENTSYSTEM.Model;
using Microsoft.AspNetCore.Mvc;

namespace LAUNDRYMANAGMENTSYSTEM.Controllers
{
    [Route("api/customers")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        //object
        private CustomerData customerData = new CustomerData();

        //  GET ALL 
        // GET: api/customer
        [HttpGet]
        //ActionResult result = Noo ogolanayaa in Ok , Not found , padReuest soo celiyo ;
        public IActionResult GetAll()
        {
            
            var customers = customerData.GetAll();
            return Ok(customers);
        }


        //  GET BY ID 
        // GET: api/customer/1
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var customer = customerData.GetById(id);
            if (customer == null)
                return NotFound($"Customer with ID {id} not found.");
            return Ok(customer);
        }


        //  INSERT 
        // POST: api/customer
        [HttpPost]

       // Xogta ka timid Body-ga Request-ka ku shub object-ka customer.
        public IActionResult Create([FromBody] CustomerModel customer)
        {
            if (string.IsNullOrEmpty(customer.FullName))
                return BadRequest("FullName is required.");

            customerData.Insert(customer);
            return CreatedAtAction(nameof(GetById),
                new { id = customer.CustomerId }, customer);
        }

        //  UPDATE 
        // PUT: api/customer/1
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] CustomerModel customer)
        {
            if (id != customer.CustomerId)
                return BadRequest("ID mismatch.");

            var existing = customerData.GetById(id);
            if (existing == null)
                return NotFound($"Customer with ID {id} not found.");

            customerData.Update(customer);
            return Ok(customer);
        }

        //  DELETE 
        // DELETE: api/customer/1
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var existing = customerData.GetById(id);
            if (existing == null)
                return NotFound($"Customer with ID {id} not found.");

            customerData.Delete(id);
            return NoContent();
        }

      
    }
}