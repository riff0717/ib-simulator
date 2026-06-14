# Production Dockerfile: serve static site with nginx
FROM nginx:stable-alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy site into nginx www folder
COPY . /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Use default nginx entrypoint/cmd
