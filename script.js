// Setting the users local timezone so that clock works internationally.
const user_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log('Success | User Timezone Set: ', user_timezone);

// Function to retrieve the last updated time from any public GitHub Repository.
async function fetch_github_last_updated(owner, repository) {
    const url = `https://api.github.com/repos/${owner}/${repository}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log(url);
            throw new Error('Error | Network response was not OK. (fetch_github_last_updated)');
        }
        const data = await response.json();
        return data.updated_at;
    } catch (error) {
        console.error('Error | There was a problem with the fetch operation (fetch_github_last_updated): ', error);
    }
}

// Function to update or create a new meta tag with the property and content provided.
function update_meta_tag(property, content, type) {
    const meta_tag = document.querySelector(`meta[${type}="${property}"]`);
    if (meta_tag) {
        meta_tag.setAttribute('content', content);
    } else {
        const new_meta_tag = document.createElement('meta');
        new_meta_tag.setAttribute(`${type}`, property);
        new_meta_tag.setAttribute('content', content);
        document.head.appendChild(new_meta_tag);
    }
}

// Function to fetch the last updated time from the GitHub Repository and update the Open Graph meta tag.
async function fetch_og_updated_time() {
    const owner = 'tristanbudd';
    const repository = 'tristanbudd.com';
    const updated_time = await fetch_github_last_updated(owner, repository);
    if (updated_time) {
        update_meta_tag('og:updated_time', updated_time, 'property');

        // Also updating the last updated time in the header bar.
        const last_updated_tag = document.getElementById('last-updated');
        if (last_updated_tag) {
            const updated_time_formatted = new Date(updated_time).toLocaleString('en-GB', { timeZone: user_timezone });
            last_updated_tag.innerText = updated_time_formatted;
        }

        console.log('Success | Last Updated Time Retrieved: ', updated_time);
    } else {
        console.error('Error | No last updated time retrieved :( (fetch_og_updated_time)');
    }
}

fetch_og_updated_time().then(() => {}).catch((error) => {
    console.error('Error | There was a problem with the fetch operation (fetch_og_updated_time): ', error);
});

// Function to update the copyright notice meta tags with the current year.
async function update_copyright_notice() {
    const current_year = new Date().getFullYear();
    if (current_year) {
        const notice_content = "Copyright © Tristan Budd ".concat(current_year);
        update_meta_tag('copyright', notice_content, 'name');
        console.log('Success | Copyright current year updated: ', current_year);
    } else {
        console.error('Error | Copyright current year not retrieved :( (update_copyright_notice)');
    }
}

update_copyright_notice().then(() => {}).catch((error) => {
    console.error('Error | There was a problem attempting to update copyright notice (update_copyright_notice): ', error);
});

// Function to show an on-screen clock in the header bar and keep it updating every second.
function update_current_time() {
    const current_time = new Date().toLocaleTimeString('en-GB', { timeZone: user_timezone });
    const current_time_tag = document.getElementById('current-time');
    if (current_time_tag) {
        current_time_tag.innerText = current_time;
    }
}

update_current_time();
setInterval(update_current_time, 1000);