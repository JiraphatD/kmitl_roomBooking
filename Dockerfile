# Dockerfile for PostgreSQL
FROM postgres:13

# Set environment variables
ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=mypassword
ENV POSTGRES_DB=mydb

# Expose PostgreSQL port
EXPOSE 5432

# Dockerfile for pgAdmin
FROM dpage/pgadmin4

# Set environment variables
ENV PGADMIN_DEFAULT_EMAIL=admin@admin.com
ENV PGADMIN_DEFAULT_PASSWORD=root

# Expose pgAdmin port
EXPOSE 80