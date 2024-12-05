// Channel data (can be fetched from an API or a database)
const channels = [
    { name: "BTV", logo: "btv_logo.png", streamLink: "https://link_to_btv_stream.com" },
    { name: "Channel 1", logo: "channel1_logo.png", streamLink: "https://link_to_channel1_stream.com" },
    { name: "Channel 2", logo: "channel2_logo.png", streamLink: "https://link_to_channel2_stream.com" },
    { name: "Channel 3", logo: "channel3_logo.png", streamLink: "https://link_to_channel3_stream.com" },
    // Add 1000+ channels here
];

// Function to load channels dynamically
function loadChannels(channelsData) {
    const channelList = document.getElementById("channel-list");
    channelList.innerHTML = '';  // Clear existing list

    channelsData.forEach(channel => {
        const channelDiv = document.createElement("div");
        channelDiv.classList.add("channel-item");

        channelDiv.innerHTML = `
            <img src="${channel.logo}" alt="${channel.name} Logo">
            <h3>${channel.name}</h3>
            <a href="${channel.streamLink}" target="_blank">Watch Now</a>
        `;

        channelList.appendChild(channelDiv);
    });
}

// Search functionality
document.getElementById("search").addEventListener("input", function(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredChannels = channels.filter(channel => 
        channel.name.toLowerCase().includes(searchTerm)
    );
    loadChannels(filteredChannels);
});

// Load all channels on initial load
loadChannels(channels);
