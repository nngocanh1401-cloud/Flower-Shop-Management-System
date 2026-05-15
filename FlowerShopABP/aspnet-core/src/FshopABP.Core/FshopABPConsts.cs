using FshopABP.Debugging;

namespace FshopABP;

public class FshopABPConsts
{
    public const string LocalizationSourceName = "FshopABP";

    public const string ConnectionStringName = "Default";

    public const bool MultiTenancyEnabled = true;


    /// <summary>
    /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
    /// </summary>
    public static readonly string DefaultPassPhrase =
        DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "3f641d37cbf34a89b2d46c4266a5f966";
}
