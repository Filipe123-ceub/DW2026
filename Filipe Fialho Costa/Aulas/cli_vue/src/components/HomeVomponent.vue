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
            nome: "Rubens Corado",
            altura: 1.75,
            url: "https://www.rubenscorado.com.br"
        };
    }, 
    mounted(){
        setTimeout(() => {
            this.url = "https://www.rubenscorado.com.br/curso-vuejs";
        }, 3000);
    }
};
</script>
