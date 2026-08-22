const cursos = [
    {
        id: 1,
        nome : "HTML e CSS",
        descricao:"Aprenda a estrutura",
        cargaHoraria: 40,
        ativo: true,
        categoria:"Frontend"
    },
     {
        id: 2,
        nome: "JavaScript",
        descricao: "Aprenda a programar",
        cargaHoraria: 40,
        ativo: true,
        categoria: "Backend"
     }    
];


const listaCursos = document.querySelector("#ListaCursos");
const btnTodos = document.querySelector("#btnTodos");
const btnAtivos = document.querySelector("#btnAtivos");

function renderizarCursos(lista) {

    listaCursos.innerHTML = "";

    lista.forEach(curso => {

        const card =
             
            <div></div>
 
    });

}