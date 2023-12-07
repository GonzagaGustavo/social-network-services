# Architecture

1. **src**: Pasta raiz do código-fonte da aplicação.

   - **app**: Contém a camada de aplicação da Clean Architecture.
     - **controllers**: Responsável por receber as requisições HTTP e encaminhá-las para os casos de uso adequados.
     - **middlewares**: Contém middlewares para processar e tratar as requisições.
     - **routes**: Define as rotas HTTP e mapeia os controladores correspondentes.
   - **domain**: Contém a camada de domínio, onde os conceitos do DDD são implementados.
     - **entities**: Contém as entidades do domínio, como User, Video, Comment, etc.
     - **repositories**: Define as interfaces e implementações dos repositórios que lidam com a persistência de dados.
     - **services**: Contém serviços de domínio que encapsulam a lógica de negócio complexa.
     - **value-objects**: Contém os objetos de valor do domínio, como VideoURL, CommentContent, etc.
   - **interfaces**: Contém interfaces externas, como adaptadores para frameworks ou bibliotecas externas.
     - **repositories**: Implementa as interfaces de repositórios definidas na camada de domínio.
   - **framework**: Contém os adaptadores específicos do framework utilizado (Express).
     - **database**: Implementa a integração com o banco de dados.
     - **server**: Configura e inicializa o servidor Express.

2. **test**: Pasta contendo os tests automatizados da aplicação.

   - **unit**: Contém tests unitários para as entidades, serviços e objetos de valor.
   - **integration**: Contém tests de integração para garantir a interação adequada entre as camadas.

3. **config**: Contém arquivos de configuração da aplicação, como configurações de banco de dados, autenticação, etc.

4. **database**: Pasta contendo scripts e configurações relacionadas ao banco de dados.

5. **public**: Pasta para arquivos estáticos, como imagens, CSS e JavaScript.
