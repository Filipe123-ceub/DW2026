<template>
    <div>
        <header>
            <p>Seja bem-vindo, {{ nome }}!</p>
            <img src="@/assets/logo.png" alt="Vue logo"
            width="100"
            height="100"
             />
        </header>
    </div>
</template>

<script>

export default{
    name: 'HomeComponent',
    data() {
        return {
            nome: "Filipe Fialho",
            altura: 1.75,
            url: "https://www.FilipeFialho.com.br"
        };
    }, 
    mounted(){
        setTimeout(() => {
            this.url = "https://www.FilipeFialho.com.br/curso-vuejs";
        }, 3000);
    }
};
</script>
