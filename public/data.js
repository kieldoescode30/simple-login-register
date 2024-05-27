let dataHTML = '';

document.addEventListener('DOMContentLoaded', () => {
  fetch("http://localhost:4000/success")
  .then(response => response.json())
  .then(data => {
    data.forEach((acc, index) => {
      dataHTML += `
        <li>
          <h3>Student ${index + 1}</h3>
          <p>Fullname: ${acc.lastname}, ${acc.firstname}</p>
          <p>Contact No: ${acc.contactnumber}</p>
          <p>Email: ${acc.email}</p>
        </li>
      `
    });

    document.querySelector('.js-unordered-list').innerHTML = dataHTML;
  })
})