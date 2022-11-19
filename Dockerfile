FROM python:3.8

WORKDIR /opt/app

RUN apt-get update && apt-get install -y pandoc git-lfs

RUN python -m venv env

COPY requirements.txt ./

RUN env/bin/pip install --no-cache-dir -r requirements.txt

ENV PYTHON_COMMAND=/opt/app/env/bin/python

RUN git clone https://gitlab.com/diogoalmiro/iris-lfs-storage.git
RUN cd iris-lfs-storage && git lfs pull
RUN mv iris-lfs-storage/word2vec.model .
RUN mv iris-lfs-storage/model-best/ .

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

RUN apt-get install nodejs -y 

COPY package.json package.json

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "./entrypoint.sh" ]
