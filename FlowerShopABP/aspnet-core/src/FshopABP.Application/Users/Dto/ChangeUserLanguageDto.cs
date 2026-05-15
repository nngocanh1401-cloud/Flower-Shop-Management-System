using System.ComponentModel.DataAnnotations;

namespace FshopABP.Users.Dto;

public class ChangeUserLanguageDto
{
    [Required]
    public string LanguageName { get; set; }
}