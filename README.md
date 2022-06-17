# Dance with Death challenge

Created by Fernando Villarreal Céspedes.

## Description

Dance with Dead full stack developer challenge.

## Installation instructions

- **NOTE:** A Linux OS machine with Docker and Docker Compose installed is required for deployment.

1. Download or clone this repository.
2. Go to Challenge folder.
3. Open a terminal and run the ```sudo chmod 777 /var/run/docker.sock``` command to grant file/folder acctions.
4. Create a "createDbUser.js" file in the Docker folder (a example file named "createDbUser.js.example" is provided).
5. Then create a "docker-compose.yml" file in the Docker folder (a example file named "docker-compose.yml.example" is provided).
6. Set up your environment variables in Backend and Frontend/challenge folders (a example filed named ".env.example" is provided in each folder).
7. Run the ```docker-compose up -d``` command in the Docker folder.
8. Run the ```docker network ls``` command to check if the "docker_app-network" network is running on Docker.
9. Then run the ```docker inspect docker_app-network``` command. Go to "Containers" section, find the one named "challenge-backend" and copy the "IPv4Address" property without the "/" and the following number.
10. Paste the "IPv4Address" property from the previous step into the "VUE_APP_BACKEND_URL" field of the "Frontend/challenge/.env" file replacing the value "localhost" and into the "BACKEND_HOST" field of the "Backend/.env" file also replacing the value "localhost".
11. Run the ```docker-compose build -d``` command in the Docker folder.
12. Repeat step 7.
13. Finally, you can enter the application through a web browser by visiting the url "http://localhost:4004/".