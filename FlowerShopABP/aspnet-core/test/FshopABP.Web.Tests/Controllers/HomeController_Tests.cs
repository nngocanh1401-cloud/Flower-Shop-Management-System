using FshopABP.Models.TokenAuth;
using FshopABP.Web.Controllers;
using Shouldly;
using System.Threading.Tasks;
using Xunit;

namespace FshopABP.Web.Tests.Controllers;

public class HomeController_Tests : FshopABPWebTestBase
{
    [Fact]
    public async Task Index_Test()
    {
        await AuthenticateAsync(null, new AuthenticateModel
        {
            UserNameOrEmailAddress = "admin",
            Password = "123qwe"
        });

        //Act
        var response = await GetResponseAsStringAsync(
            GetUrl<HomeController>(nameof(HomeController.Index))
        );

        //Assert
        response.ShouldNotBeNullOrEmpty();
    }
}