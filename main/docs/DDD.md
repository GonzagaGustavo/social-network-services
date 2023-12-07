# DDD

**Dominio**:
O domínio principal dessa aplicação é o compartilhamento de vídeos. O sistema deve permitir que os usuários carreguem, assistam e interajam com vídeos. Além disso, ele deve incluir recursos como informações de vídeos, curtidas, comentários, perfis de usuários e um feed personalizado.

**Propósito**:
O propósito dessa aplicação é fornecer uma plataforma para que as pessoas compartilhem seus vídeos com outras pessoas, expressem suas opiniões, descubram conteúdo novo e se conectem com outras pessoas com interesses semelhantes. O objetivo é criar uma comunidade em torno do compartilhamento de vídeos, onde os usuários possam se expressar, interagir e descobrir conteúdo relevante.

**Entities**

<ol>
    <li>Usuário: Representa um usuário registrado na aplicação, que possui um perfil e pode interagir com os vídeos compartilhados. Ele pode realizar ações como fazer upload de vídeos, curtir, comentar, seguir outros usuários, etc.</li>
    <li>Vídeo: Representa um vídeo compartilhado na plataforma. Ele possui informações como título, descrição, URL do vídeo, número de visualizações, número de curtidas e comentários. Os usuários podem assistir, curtir, comentar e compartilhar os vídeos.</li>
    <li>Comentário: Representa um comentário feito por um usuário em um vídeo. Ele possui informações como o conteúdo do comentário, a data/hora em que foi feito e o usuário que o fez. Os usuários podem adicionar comentários aos vídeos e interagir por meio de respostas aos comentários.</li>
    <li>Perfil: Representa o perfil de um usuário na aplicação. Ele contém informações sobre o usuário, como nome, foto, descrição, lista de vídeos compartilhados e lista de vídeos curtidos. O perfil pode ser visualizado por outros usuários e serve como uma representação do usuário na plataforma.</li>
    <li>Feed: Representa o feed de vídeos personalizado para cada usuário. Ele contém uma lista de vídeos relevantes com base nos interesses, preferências e interações do usuário. O feed é atualizado conforme novos vídeos são compartilhados ou conforme os interesses do usuário mudam.</li>
    <li>Seguidor: Representa a relação de um usuário que segue outro usuário na aplicação. Os usuários podem escolher seguir outros usuários para receber atualizações sobre os vídeos que eles compartilham. Essa entidade pode ser usada para gerenciar as conexões sociais entre os usuários.</li>
    <li>Curtida: Representa uma ação de curtir realizada por um usuário em um vídeo. Ele contém informações como o usuário que realizou a curtida e o vídeo que foi curtido.</li>
    <li>Categoria: Representa a categoria a qual um vídeo pode pertencer. Isso permite aos usuários navegar e descobrir vídeos com base em categorias específicas, como música, esportes, entretenimento, etc.
    </li>
    <li>Notificação: Representa uma notificação enviada aos usuários para informá-los sobre atividades relevantes, como comentários em seus vídeos, novos seguidores, etc.</li>
</ol>

**Use Case**

<ol>
<li>Registrar usuário: Um novo usuário pode se registrar na aplicação, fornecendo informações básicas como nome, endereço de e-mail e senha.</li>

<li>Fazer login: Os usuários registrados podem fazer login na aplicação usando suas credenciais de acesso.</li>

<li>Fazer upload de vídeo: Os usuários autenticados podem fazer o upload de um vídeo para compartilhá-lo na plataforma. Isso envolve selecionar o arquivo de vídeo, adicionar informações como título e descrição, e enviar o vídeo para armazenamento.</li>

<li>Assistir vídeo: Os usuários podem assistir aos vídeos compartilhados na plataforma. Eles podem visualizar detalhes do vídeo, como título, descrição, número de visualizações, curtidas e comentários, e reproduzir o vídeo.</li>

<li>Curtir vídeo: Os usuários podem curtir um vídeo para expressar sua apreciação. Isso envolve clicar em um botão de "Curtir" associado ao vídeo.</li>

<li>Comentar em vídeo: Os usuários podem adicionar comentários aos vídeos para fornecer feedback, iniciar discussões ou interagir com outros usuários. Eles podem digitar o comentário em uma caixa de texto e enviá-lo.</li>

<li>Visualizar perfil do usuário: Os usuários podem visualizar o perfil de outros usuários, que inclui informações como nome, foto, descrição e lista de vídeos compartilhados.</li>

<li>Seguir usuário: Os usuários podem optar por seguir outros usuários para receber atualizações sobre os vídeos que eles compartilham. Isso envolve encontrar o perfil do usuário desejado e selecionar a opção de "Seguir".</li>

<li>Explorar vídeos: Os usuários podem explorar vídeos com base em diferentes critérios, como vídeos populares, vídeos recentes ou vídeos de categorias específicas. Isso permite a descoberta de novos conteúdos.</li>

<li>Personalizar feed: Os usuários podem personalizar seu feed de vídeos com base em seus interesses e preferências. Eles podem seguir categorias ou selecionar tópicos de seu interesse para receber recomendações de vídeos relevantes.</li>

<li>Editar perfil do usuário: Permite que os usuários atualizem as informações em seus perfis, como foto, descrição e interesses.</li>

<li>Pesquisar vídeos: Permite aos usuários realizar pesquisas por palavras-chave para encontrar vídeos específicos com base em seus interesses.</li>

<li>Compartilhar vídeo: Permite que os usuários compartilhem um vídeo em outras plataformas ou por meio de links diretos.</li>

<li>Excluir vídeo: Permite que os usuários removam um vídeo que eles compartilharam anteriormente.
Responder a comentários: Permite que os usuários respondam a comentários específicos em um vídeo, permitindo discussões e interações mais aprofundadas.</li>

<li>Gerenciar configurações de privacidade: Permite aos usuários definir as configurações de privacidade de seus vídeos, como torná-los públicos, privados ou visíveis apenas para seguidores.</li>

</ol>

**Repositories**

<ol>
    <li>UserRepository: Responsável por persistir e recuperar informações relacionadas aos usuários, como registro, autenticação e gerenciamento de perfis.</li>
    <li>VideoRepository: Responsável por persistir e recuperar informações relacionadas aos vídeos, como upload, detalhes do vídeo, estatísticas e interações.</li>
</ol>

**Services**

<ol>
    <li>AuthenticationService: Responsável pela autenticação de usuários e gerenciamento de sessões de login.</li>
    <li>VideoUploadService: Responsável pelo processo de upload de vídeos, validação de formatos, armazenamento e processamento.</li>
    <li>FeedService: Responsável por gerar e atualizar o feed personalizado para cada usuário com base em seus interesses, preferências e interações.</li>
</ol>

**Aggregate**

<ol>
    <li>UserAggregate: Agrupa entidades relacionadas ao usuário, como UserProfile, Follower, LikedVideo, etc. É responsável por manter a consistência entre as entidades dentro do agregado.</li>
    <li>VideoAggregate: Agrupa entidades relacionadas ao vídeo, como VideoDetails, Comment, Like, etc. Também é responsável por garantir a consistência das entidades dentro do agregado.</li>
</ol>

**Value Objects**

<ol>
    <li>VideoURL: Objeto de valor que representa a URL de um vídeo.</li>
    <li>CommentContent: Objeto de valor que representa o conteúdo de um comentário.</li>
    <li>CategoryName: Objeto de valor que representa o nome de uma categoria de vídeo.</li>
</ol>
