# Use an official Python image as a base
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application files
COPY . .

# Expose the port the server runs on (if applicable)
EXPOSE 8080

# Command to run the application
CMD ["python", "server.py"]
