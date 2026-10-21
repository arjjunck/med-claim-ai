# Build (runs natively on the build machine and cross-compiles for the target platform)
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG TARGETARCH
WORKDIR /src

# Restore first so this layer is cached until a project file changes
COPY MediClaim.Domain/MediClaim.Domain.csproj MediClaim.Domain/
COPY MediClaim.Application/MediClaim.Application.csproj MediClaim.Application/
COPY MediClaim.Infrastructure/MediClaim.Infrastructure.csproj MediClaim.Infrastructure/
COPY MediClaim.Api/MediClaim.Api.csproj MediClaim.Api/
RUN dotnet restore MediClaim.Api/MediClaim.Api.csproj -a $TARGETARCH

COPY . .
RUN dotnet publish MediClaim.Api/MediClaim.Api.csproj -c Release -a $TARGETARCH -o /app --no-restore

# Run
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
USER $APP_UID
ENTRYPOINT ["dotnet", "MediClaim.Api.dll"]
