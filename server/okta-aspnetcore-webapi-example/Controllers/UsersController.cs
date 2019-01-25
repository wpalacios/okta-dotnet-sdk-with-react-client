using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Okta.Sdk;
using Okta.Sdk.Configuration;
using okta_aspnetcore_webapi_example.Models;

namespace okta_aspnetcore_webapi_example.Controllers
{
    [Produces("application/json")]
    [Authorize]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        #region Fields
        public OktaClient Client { get; set; }
        public IConfiguration Config { get; set; }
        #endregion

        // TODO: SETUP DEPENDENCY INJECTION
        public UsersController(IConfiguration config)
        {
            Config = config;
            Client = new OktaClient(new OktaClientConfiguration
            {
                OktaDomain = Config["Okta:OktaDomain"],
                Token = Config["Okta:ApiKey"]
            });
        }

        #region Get

        [Route(""), HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await Client.Users.ListUsers().ToArray();

            return Ok(users);
        }

        [HttpGet]
        [Route("{userId}/details")]
        public IEnumerable<dynamic> Get(string userId)
        {
            var principal = HttpContext.User.Identity as ClaimsIdentity;
            var userDetails = new List<dynamic>();

            int i = 0;
            foreach (var item in principal.Claims)
            {
                userDetails.Add(new
                {
                    Id = i,
                    Name = item.Type,
                    Value = item.Value
                });

                i++;
            }

            return userDetails;
        }

        #endregion

        #region Post

        [HttpPost]
        [Route("")]
        public async Task<IActionResult> CreateUserAsync([FromBody] UserModel newUser)
        {
            try
            {
                if (string.IsNullOrEmpty(newUser.Email) || string.IsNullOrEmpty(newUser.Password) ||
                string.IsNullOrEmpty(newUser.FirstName) || string.IsNullOrEmpty(newUser.LastName))
                    return BadRequest("Invalid user information");

                var user = await Client.Users.CreateUserAsync(new CreateUserWithPasswordOptions
                {
                    Profile = new UserProfile
                    {
                        FirstName = newUser.FirstName,
                        LastName = newUser.LastName,
                        Email = newUser.Email,
                        Login = newUser.Login,
                    },
                    Password = newUser.Password,
                    Activate = false,
                });
                return Ok(user);
            }
            catch (System.Exception e)
            {
                // TODO: log the exception and return human-friendly message
                return StatusCode(500, e.Message);
            }
        }

        [HttpPost]
        [Route("{userId}/activation")]
        public async Task<IActionResult> Activate(string userId)
        {
            try
            {
                var user = await Client.Users.GetUserAsync(userId);
                if (user == null)
                    return BadRequest("Invalid User");

                // Change to true to send an email to user
                IUserActivationToken activationToken = await user.ActivateAsync(false);
                return Ok(new { user, activationToken });
            }
            catch (System.Exception e)
            {
                // TODO: log the exception and return human-friendly message
                return StatusCode(500, e.Message);
            }
        }

        [HttpPost]
        [Route("{userId}/deactivation")]
        public async Task<IActionResult> Deactivate(string userId)
        {
            try
            {
                var user = await Client.Users.GetUserAsync(userId);
                if (user == null)
                    return BadRequest("Invalid User");

                // Change to true to send an email to user
                await user.DeactivateAsync(false);
                return Ok(new { user });
            }
            catch (System.Exception e)
            {
                // TODO: log the exception and return human-friendly message
                return StatusCode(500, e.Message);
            }
        }

        [HttpPost]
        [Route("{userId}/password")]
        public async Task<IActionResult> ChangePassword(string userId, 
            [FromBody] CredentialsModel userCredentials)
        {
            try
            {
                var user = await Client.Users.GetUserAsync(userId);
                if (user == null)
                    return BadRequest("Invalid User");

                var credentials = await user.ChangePasswordAsync(new ChangePasswordOptions() {
                    CurrentPassword = userCredentials.CurrentPassword,
                    NewPassword = userCredentials.NewPassword
                });

                if (credentials == null) 
                    return BadRequest();
                
                return Ok();
            }
            catch (System.Exception e)
            {
                // TODO: log the exception and return human-friendly message
                return StatusCode(500, e.Message);
            }
        }
        #endregion
    }
}