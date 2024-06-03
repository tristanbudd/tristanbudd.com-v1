// Simple function to retrieve the last updated time from any public GitHub Repository.
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
function update_meta_tag(property, content) {
    const meta_tag = document.querySelector(`meta[property="${property}"]`);
    if (meta_tag) {
        meta_tag.setAttribute('content', content);
    } else {
        const new_meta_tag = document.createElement('meta');
        new_meta_tag.setAttribute('property', property);
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
        update_meta_tag('og:updated_time', updated_time);
        console.log('Success | Last Updated Time Retrieved: ', updated_time);
    } else {
        console.error('Error | No last updated time retrieved :( (fetch_og_updated_time)');
    }
}

fetch_og_updated_time().then(() => {}).catch((error) => {
    console.error('Error | There was a problem with the fetch operation (fetch_og_updated_time): ', error);
});

