# Use the official Python image from the DockerHub
FROM python:3.9-slim

# Set the working directory in docker
WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt .

RUN apt-get update \
    && apt-get -y install libpq-dev gcc \
    && pip install psycopg2
# Install any dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the content of the local src directory to the working directory
COPY . .

# Specify the command to run on container start
CMD ["uvicorn", "heaven2hell:app", "--host", "0.0.0.0", "--port", "6547", "--reload"]