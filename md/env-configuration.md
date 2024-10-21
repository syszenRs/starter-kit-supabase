# How to configure your environment

[go back](../README.md)

Follow this to install and configure all the dev environment.
We will install and configure git, vscode, nodeJs and docker.
We use VSCode as an editor, you can use whatever you want.

**#1 install [nodeJS](https://nodejs.org/en)**

**#2 install Editor at your choose**

**#3 install [git](https://git-scm.com/downloads)**

during installation select "Use Visual Studio code as Git's default editor" if is your editor of choice.
after install:

- open CMD
  - run `git config --global user.name "FirstName LastName"`
  - run `git config --global user.email johndoe@example.com`
- check if the values where correctly assigned using `git config --list`

**#4 Open VSCode**

(ignore this if not using VSCode)
Extensions used (they are just sugestion):

- Todo Tree: used to show all the Todo's in the code, easier to validatem them
- Git Graph: to use git and check branches visually
- Prettier - code formatter
- svelte auto import
- svelte for VS code
- svelte intellisense
- Pretty TypeScript Errors
- tailwind CSS intelliSense

**#5 Download and Install [docker](https://docs.docker.com/desktop/install/windows-install/)**

**#6 Supabase**

> We use Supabase locally, so if a functionality is being worked on and changes the DB model will not impact others on the dev environment until that change is pushed

- Make sure Docker is running
  go to docker settings/general and check option `Expose daemon on tcp://localhost:2375 without TLS`
- run `npx supabase init` (IGNORE THIS STEP IF the project already contains a "supabase" folder)
- In the .env file set
  - SUPABASE_ACCESS_TOKEN = this token should be given by someone with supabase account access
- run `npx supabase link --project-ref PROJECTREF` > should be given by someone with supabase account access
- run `npx supabase start` and this will install the docker images and start the database
- In the .env file set
  - PUBLIC_SUPABASE_URL = `API URL` given in the previous step
  - PUBLIC_SUPABASE_ANON_KEY = `anon key` given in the previous step
