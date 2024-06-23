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
            last_updated_tag.innerText = new Date(updated_time).toLocaleString('en-GB', {timeZone: user_timezone});
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

// Back to top button visibility and functionality.
function scroll_to_top() {
    globalThis.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

function toggle_back_to_top_button() {
    const back_to_top_button = document.getElementById('back-to-top-button');
    if (globalThis.scrollY > 400) {
        back_to_top_button.style.display = 'block';
    } else {
        back_to_top_button.style.display = 'none';
    }
}

toggle_back_to_top_button();
globalThis.addEventListener('scroll', toggle_back_to_top_button);

// Smooth Section Scroll Functionality
const scroll_wrapper = document.querySelector('.scroll-wrapper');
let is_scrolling;
let last_scroll_top = scroll_wrapper.scrollTop;

scroll_wrapper.addEventListener('scroll', () => {
    window.clearTimeout(is_scrolling);

    is_scrolling = setTimeout(() => {
        const scroll_sections = document.querySelectorAll('.scroll-section');
        const scroll_position = scroll_wrapper.scrollTop;
        const scroll_direction = scroll_position > last_scroll_top ? 'down' : 'up';
        last_scroll_top = scroll_position;

        let target_section;
        scroll_sections.forEach((section, index) => {
            if (scroll_direction === 'down' && scroll_position >= section.offsetTop && scroll_position < section.offsetTop + section.offsetHeight) {
                target_section = scroll_sections[index + 1];
            } else if (scroll_direction === 'up' && scroll_position <= section.offsetTop && scroll_position > section.offsetTop - section.offsetHeight) {
                target_section = scroll_sections[index - 1];
            }
        });

        if (target_section) {
            target_section.scrollIntoView({ behavior: 'smooth' });
        }
    }, 150);
});