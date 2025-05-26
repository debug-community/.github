import axios from 'axios';
import fs from 'fs';

const ORG = 'debug-community';
const TOKEN = process.env.GH_TOKEN;

async function generateReadme() {
  const members = await axios.get(`https://api.github.com/orgs/${ORG}/members`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  console.log(`Found ${members.data.length} members in the organization ${ORG}`);

  const profileData = await Promise.all(
    members.data.map(async (member) => {
      const user = await axios.get(member.url, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      console.log(`Fetching data for ${user.data.login}`);

      return {
        login: user.data.login,
        avatar_url: user.data.avatar_url,
      };
    })
  );

  console.log('Generating README...');

  const avatars = profileData
  .map(
    (user) =>
      `<a href="https://github.com/${user.login}">
        <img src="${user.avatar_url}" width="60" alt="${user.login}" />
      </a>`
  )
  .join('\n');

  const readmeContent = `
  ## Hi there 👋

  <!--

  **Here are some ideas to get you started:**

  🙋‍♀️ A short introduction - what is your organization all about?
  🌈 Contribution guidelines - how can the community get involved?
  👩‍💻 Useful resources - where can the community find your docs? Is there anything else the community should know?
  🍿 Fun facts - what does your team eat for breakfast?
  🧙 Remember, you can do mighty things with the power of [Markdown](https://docs.github.com/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
  -->
  Debug 커뮤니티의 GitHub Organization 입니다.

  ## 👥 Organization Members
  ${avatars}

  ## Want to join?
  <a href="https://discord.gg/7sAYdbff">
    <img src="https://skillicons.dev/icons?i=discord" width="32" height="32" alt="Discord"/>
  </a>

  ## contect
  <a href="mailto:debug331@gmail.com">
    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png" width="32" height="32" alt="Gmail"/>
  </a>
  `;

  fs.writeFileSync('profile/README.md', readmeContent);
}

generateReadme();
