using LAUNDRYMANAGMENTSYSTEM.Data;
using LAUNDRYMANAGMENTSYSTEM.Model;
using Microsoft.AspNetCore.Mvc;

namespace LAUNDRYMANAGMENTSYSTEM.Controllers
{
    [Route("api/services")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        private ServiceData _serviceData = new ServiceData();

        // ==================== GET ALL ====================
        // GET: api/service
        [HttpGet]
        public IActionResult GetAll()
        {
            var services = _serviceData.GetAll();
            return Ok(services);
        }

        // ==================== GET BY ID ====================
        // GET: api/service/1
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var service = _serviceData.GetById(id);
            if (service == null)
                return NotFound($"Service with ID {id} not found.");
            return Ok(service);
        }

        // ==================== INSERT ====================
        // POST: api/service
        [HttpPost]
        public IActionResult Create([FromBody] ServiceModel service)
        {
            if (string.IsNullOrEmpty(service.ServiceName))
                return BadRequest("ServiceName is required.");

            _serviceData.Insert(service);
            return CreatedAtAction(nameof(GetById), new { id = service.ServiceId }, service);
        }

        // ==================== UPDATE ====================
        // PUT: api/service/1
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] ServiceModel service)
        {
            if (id != service.ServiceId)
                return BadRequest("ID mismatch.");

            var existing = _serviceData.GetById(id);
            if (existing == null)
                return NotFound($"Service with ID {id} not found.");

            _serviceData.Update(service);
            return Ok(service);
        }

        // ==================== DELETE ====================
        // DELETE: api/service/1
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var existing = _serviceData.GetById(id);
            if (existing == null)
                return NotFound($"Service with ID {id} not found.");

            _serviceData.Delete(id);
            return NoContent();
        }

       
    }
}