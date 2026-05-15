FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src
COPY ["src/FshopABP.Web.Host/FshopABP.Web.Host.csproj", "src/FshopABP.Web.Host/"]
COPY ["src/FshopABP.Web.Core/FshopABP.Web.Core.csproj", "src/FshopABP.Web.Core/"]
COPY ["src/FshopABP.Application/FshopABP.Application.csproj", "src/FshopABP.Application/"]
COPY ["src/FshopABP.Core/FshopABP.Core.csproj", "src/FshopABP.Core/"]
COPY ["src/FshopABP.EntityFrameworkCore/FshopABP.EntityFrameworkCore.csproj", "src/FshopABP.EntityFrameworkCore/"]
WORKDIR "/src/src/FshopABP.Web.Host"
RUN dotnet restore 

WORKDIR /src
COPY ["src/FshopABP.Web.Host", "src/FshopABP.Web.Host"]
COPY ["src/FshopABP.Web.Core", "src/FshopABP.Web.Core"]
COPY ["src/FshopABP.Application", "src/FshopABP.Application"]
COPY ["src/FshopABP.Core", "src/FshopABP.Core"]
COPY ["src/FshopABP.EntityFrameworkCore", "src/FshopABP.EntityFrameworkCore"]
WORKDIR "/src/src/FshopABP.Web.Host"
RUN dotnet publish -c Release -o /publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
EXPOSE 80
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "FshopABP.Web.Host.dll"]
