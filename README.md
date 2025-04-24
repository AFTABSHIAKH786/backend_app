This project sets up a Node.js + Express API to interact with a PostgreSQL database and upload files to MinIO using Prisma ORM.

🔧 Technologies Used  
Node.js for the backend  

Express.js for routing  

PostgreSQL for the database  

MinIO for file storage (S3 compatible)  

Prisma ORM for interacting with the PostgreSQL database  

🚀 Project Setup  
1. Docker Setup  
We used Docker to run PostgreSQL and MinIO containers.  

PostgreSQL Container:  
To run PostgreSQL:  

```bash
docker run -d --name postgres_container -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=mydb -p 5432:5432 postgres:13
```  

MinIO Container:  
To run MinIO:  

```bash
docker run -d --name minio_container -p 9000:9000 -e MINIO_ACCESS_KEY=minioadmin -e MINIO_SECRET_KEY=minioadmin minio/minio server /data
```  

2. Environment Variables  
Make sure you have the following environment variables set (in .env or directly in your Docker setup):  

```env
DATABASE_URL=postgresql://postgres:postgres@postgres_container:5432/mydb
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=uploads
```  

3. Prisma Setup  
We used Prisma as the ORM to interact with PostgreSQL:  

Install Prisma and generate the client:  

```bash
npm install prisma @prisma/client
npx prisma init
```  

Define the PostgreSQL connection string in your .env.  

Generate Prisma Client:  

```bash
npx prisma generate
```  

Run the Prisma migrations to set up the database schema:  

```bash
npx prisma migrate dev
