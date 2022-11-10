FROM python:3.7 as builder

WORKDIR /opt/app

RUN python -m venv env
ENV PATH="/opt/app/env/bin:$PATH"

RUN pip install --upgrade pip
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

FROM node:lts

WORKDIR /opt/app
COPY --from=builder /opt/app/env /opt/app/env
RUN ln -s /usr/bin/python3 /usr/local/bin/python
ENV PATH="/opt/app/env/bin:$PATH"

COPY package.json package.json
RUN npm install

RUN apt-get update && apt-get install -y pandoc

COPY . .

EXPOSE 3000

CMD [ "./entrypoint.sh" ]
