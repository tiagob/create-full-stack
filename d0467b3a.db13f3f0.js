(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{73:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return o})),a.d(t,"metadata",(function(){return s})),a.d(t,"rightToc",(function(){return c})),a.d(t,"default",(function(){return m}));var r=a(2),n=a(6),i=(a(0),a(81)),o={id:"migrations",title:"Migrations"},s={unversionedId:"migrations",id:"migrations",isDocsHomePage:!1,title:"Migrations",description:"Apollo Server Express",source:"@site/docs/migrations.md",slug:"/migrations",permalink:"/docs/migrations",editUrl:"https://github.com/tiagob/create-full-stack/edit/master/packages/docusaurus/docs/migrations.md",version:"current",sidebar:"someSidebar",previous:{title:"Configuration",permalink:"/docs/configuration"},next:{title:"Gotchas",permalink:"/docs/gotchas"}},c=[{value:"Apollo Server Express",id:"apollo-server-express",children:[{value:"<code>yarn typeorm migration:run</code>",id:"yarn-typeorm-migrationrun",children:[]},{value:"<code>yarn typeorm migration:revert</code>",id:"yarn-typeorm-migrationrevert",children:[]},{value:"<code>yarn typeorm migration:generate -n &lt;title&gt;</code>",id:"yarn-typeorm-migrationgenerate--n-title",children:[]}]},{value:"Hasura",id:"hasura",children:[{value:"<code>yarn hasura migrate apply</code>",id:"yarn-hasura-migrate-apply",children:[]},{value:"<code>hasura migrate status</code>",id:"hasura-migrate-status",children:[]}]},{value:"Resetting Docker Postgres locally",id:"resetting-docker-postgres-locally",children:[]}],l={rightToc:c};function m(e){var t=e.components,a=Object(n.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},l,a,{components:t,mdxType:"MDXLayout"}),Object(i.b)("h2",{id:"apollo-server-express"},"Apollo Server Express"),Object(i.b)("p",null,"If included, run from ",Object(i.b)("inlineCode",{parentName:"p"},"packages/server"),"."),Object(i.b)("p",null,"Common commands are shown below. Additional commands are documented at ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"https://typeorm.io/#/migrations"}),"https://typeorm.io/#/migrations")),Object(i.b)("h3",{id:"yarn-typeorm-migrationrun"},Object(i.b)("inlineCode",{parentName:"h3"},"yarn typeorm migration:run")),Object(i.b)("p",null,"Executes all pending migrations and runs them in a sequence ordered by their timestamps. This means all sql queries written in the up methods of your created migrations will be executed."),Object(i.b)("h3",{id:"yarn-typeorm-migrationrevert"},Object(i.b)("inlineCode",{parentName:"h3"},"yarn typeorm migration:revert")),Object(i.b)("p",null,"Executes down in the latest executed migration. If you need to revert multiple migrations you must call this command multiple times."),Object(i.b)("h3",{id:"yarn-typeorm-migrationgenerate--n-title"},Object(i.b)("inlineCode",{parentName:"h3"},"yarn typeorm migration:generate -n <title>")),Object(i.b)("p",null,"Automatically generate migration files in the format ",Object(i.b)("inlineCode",{parentName:"p"},"{TIMESTAMP}-{title}.ts")," with schema changes you made."),Object(i.b)("h2",{id:"hasura"},"Hasura"),Object(i.b)("p",null,"If included, run from ",Object(i.b)("inlineCode",{parentName:"p"},"packages/server"),"."),Object(i.b)("p",null,"Common commands are shown below. Additional commands are documented at ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"https://hasura.io/docs/1.0/graphql/core/hasura-cli/hasura_migrate.html#hasura-migrate"}),"https://hasura.io/docs/1.0/graphql/core/hasura-cli/hasura_migrate.html#hasura-migrate"),". Learn more about Hasura migrations at ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"https://hasura.io/docs/1.0/graphql/core/migrations/index.html"}),"https://hasura.io/docs/1.0/graphql/core/migrations/index.html")),Object(i.b)("h3",{id:"yarn-hasura-migrate-apply"},Object(i.b)("inlineCode",{parentName:"h3"},"yarn hasura migrate apply")),Object(i.b)("p",null,"Applies all migrations to the database."),Object(i.b)("h3",{id:"hasura-migrate-status"},Object(i.b)("inlineCode",{parentName:"h3"},"hasura migrate status")),Object(i.b)("p",null,"Displays the current status of migrations on a database."),Object(i.b)("h2",{id:"resetting-docker-postgres-locally"},"Resetting Docker Postgres locally"),Object(i.b)("p",null,"Sometimes you may need to completely wipe your local Postgres DB running on Docker. For instance, you're developing Create Full Stack and switching between Auth0 and no auth \ud83d\ude03."),Object(i.b)("p",null,"Todo this remove the Docker container then the volume."),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-bash"}),"docker rm <project name>_postgres_1\ndocker volume rm <project name>_db_data\n")))}m.isMDXComponent=!0}}]);