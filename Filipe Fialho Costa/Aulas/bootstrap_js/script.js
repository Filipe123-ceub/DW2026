const cursos = [
    {
        id: 1,
        nome: "Curso de HTML",
        descricao: "Aprenda a criar páginas web com HTML.",
        duracao: "4 semanas",
        ativo: true,
        categoria: ["Web", "Front-end"]
    }
    ,{
        id: 2,
        nome: "Curso de CSS",
        descricao: "Aprenda a estilizar páginas web com CSS.",
        duracao: "6 semanas",
        ativo: true,
        categoria: ["Web", "Front-end"]
    }
];

const listaCursos = document.querySelector("#listaCursos");
const btnTodos = document.querySelector("#btnTodos");
const btnAtivos = document.querySelector("#btnAtivos");

function renderizarCursos(lista) {

    listaCursos.innerHTML = "";

    lista.forEach(curso => {

        const card = `
        <div>
            <p>${curso.categoria.join(' | ')}</p>
            <h3>${curso.nome}</h3>
            <p>${curso.descricao}</p>
            <p>Duração: ${curso.duracao}</p>
        </div>`;

        listaCursos.insertAdjacentHTML("beforeend", card);
    });

}

renderizarCursos(cursos);

btnTodos.addEventListener("click", () => {
    renderizarCursos(cursos);
});

btnAtivos.addEventListener("click", () => {
    const cursosAtivos = cursos.filter(curso => curso.ativo);
    renderizarCursos(cursosAtivos);
}); 