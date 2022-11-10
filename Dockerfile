FROM node:lst

RUN python -m venv env
RUN env/bin/pip install --upgrade pip

COPY requirements.txt requirements.txt
RUN env/bin/pip install -r requirements.txt

COPY package.json package.json
RUN npm install

COPY . .

RUN npm run build

EXPOSE 7999

ENTRYPOINT [ "node", "server.js" ]
