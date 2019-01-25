namespace okta_aspnetcore_webapi_example.Models
{
    public class UserModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Login { get { return this.Email; } }
        public string Password { get; set; }
    }
}