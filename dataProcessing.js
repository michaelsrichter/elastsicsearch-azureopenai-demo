function generateContent(data) {
    return `${data.title ? `title: ${data.title}  \n` : ""}${
      data.date ? `date: ${data.date}  \n` : ""
    }${data.start_time ? `starts: ${data.start_time}  \n` : ""}${
      data.end_time ? `ends: ${data.end_time}  \n` : ""
    }${
      data.location_description
        ? `location: ${data.location_description}  \n`
        : ""
    }${data.snippet ? `description: ${data.snippet}  \n` : ""}${
      data.phone ? `phone: ${data.phone}  \n` : ""
    }${data.email ? `email: ${data.email}  \n` : ""}${
      data.cost_description
        ? `cost: ${data.cost_description}  \n`
        : "cost: free  \n"
    }`;
  }
  
  function generateContentHTML(data) {
    return `${data.title ? `<p><strong>Title:</strong> ${data.title}</p>` : ""}${
      data.date ? `<p><strong>Date:</strong> ${data.date}</p>` : ""
    }${
      data.start_time ? `<p><strong>Starts:</strong> ${data.start_time}</p>` : ""
    }${data.end_time ? `<p><strong>Ends:</strong> ${data.end_time}</p>` : ""}${
      data.location_description
        ? `<p><strong>Location:</strong> ${data.location_description}</p>`
        : ""
    }${
      data.snippet ? `<p><strong>Description:</strong> ${data.snippet}</p>` : ""
    }${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}${
      data.email ? `<p><strong>Email:</strong> ${data.email}</p>` : ""
    }${
      data.cost_description
        ? `<p><strong>Cost:</strong> ${data.cost_description}</p>`
        : "<p><strong>Cost:</strong> free</p>"
    }`;
  }

  module.exports = {
    generateContent, generateContentHTML
  };