using LAUNDRYMANAGMENTSYSTEM.Data;
using LAUNDRYMANAGMENTSYSTEM.Model;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace LAUNDRYMANAGMENTSYSTEM.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private UserData userData = new UserData();

        // GET ALL
        [HttpGet]
        public IActionResult GetAll()
        {
            var users = userData.GetAll();
            return Ok(users);
        }

        // GET BY ID
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var user = userData.GetById(id);

            if (user == null)
                return NotFound($"User with ID {id} not found.");

            return Ok(user);
        }

        // INSERT
        [HttpPost]
        public IActionResult Create([FromBody] UserModel user)
        {
            if (string.IsNullOrEmpty(user.FullName))
                return BadRequest("FullName is required.");

            if (string.IsNullOrEmpty(user.UserName))
                return BadRequest("UserName is required.");

            userData.Insert(user);

            return CreatedAtAction(nameof(GetById), new { id = user.UserId }, user);
        }

        // UPDATE
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] UserModel user)
        {
            if (id != user.UserId)
                return BadRequest("ID mismatch.");

            var existing = userData.GetById(id);
            if (existing == null)
                return NotFound($"User with ID {id} not found.");

            userData.Update(user);

            return Ok(user);
        }

        // DELETE
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var existing = userData.GetById(id);
            if (existing == null)
                return NotFound($"User with ID {id} not found.");

            userData.Delete(id);

            return NoContent();
        }

       
        // LOGIN
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest login)
        {
            if (string.IsNullOrEmpty(login.UserName) || string.IsNullOrEmpty(login.Password))
                return BadRequest("Username and Password are required.");

            bool result = userData.Login(login.UserName, login.Password);

            if (!result)
                return Unauthorized("Invalid username or password.");

            return Ok("Login successful");
        }
    }
}