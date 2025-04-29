# Technology Nest

It is a university project that consists of a basic forum for programmers.

## Installation

Clone the repository
```bash
$ git clone https://github.com/MisaelRodriguez3/TechnologyNest.git
```

Enter the project folder
```bash
$ cd TechnologyNest
```

Enter the client folder
```bash
$ cd client
```

Install front-end dependencies
```bash
$ bun install
```

Enter the server folder (being in the client folder)
```bash
$ cd ../server
```

Create a virtual enviroment
```bash
$ python -m venv .venv
```

Install back-end dependencies
```bash
$ pip install -r requirements.txt
```

Run the client
```bash
$ bun run dev
```

Run the server
```bash
$ python main.py
```

## Installation of local certificates

1. Install `mkcert`. Download the latest version [here](https://github.com/FiloSottile/mkcert/releases).

2. Add executable to environment variables (in Windows).

3. Run this to create your own local CA (if this is the first time).

```bash
$ mkcert -install
```

4. Run the following to generate a certificate for localhost.

```bash
$ mkcert localhost
```

5. Create a folder called certs inside the project folder.

6. Paste the generated files (`.pem`) inside the certs folder

