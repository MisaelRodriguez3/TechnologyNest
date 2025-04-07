function formattedDate(date_string: string) {
    const date = new Date(`${date_string}Z`);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getHours() >= 12 ? "p.m." : "a.m."}`;
    return formattedDate
}

export default formattedDate;