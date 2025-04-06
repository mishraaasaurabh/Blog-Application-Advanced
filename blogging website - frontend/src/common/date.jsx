let months = ["Jan", "Feb", "Mar", "Apr","May","Jun","Jul","Aug","sep","Oct","Nov","Dec"];
let days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]

export const getDay = (timestamp) => {
    let date = new Date(timestamp);

    return `${date.getDate()} ${months[date.getMonth()]}`
}