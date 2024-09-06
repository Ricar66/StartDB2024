// src/recintos-zoo.js
export class RecintosZoo {
    constructor() {
        // Define os recintos disponíveis no zoológico
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] }
        ];

        // Define as características das espécies de animais tratadas pelo zoológico
        this.animais = {
            'LEAO': { tamanho: 3, biomas: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, biomas: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, biomas: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, biomas: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        };
    }

    analisaRecintos(tipoAnimal, quantidade) {
        // Valida se o animal é conhecido
        if (!this.animais[tipoAnimal]) {
            return { erro: "Animal inválido" };
        }

        // Valida se a quantidade é um número válido
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const especie = this.animais[tipoAnimal];
        const recintosViaveis = [];

        // Itera sobre os recintos para encontrar os viáveis
        for (const recinto of this.recintos) {
            const espacoDisponivel = recinto.tamanho - this.calcularEspacoOcupado(recinto);

            // Checa se o recinto é viável
            if (
                this.eBiomaAdequado(recinto, especie) &&
                this.eCarnivoroAdequado(recinto, tipoAnimal) &&
                this.eEspacoSuficiente(espacoDisponivel, especie.tamanho, quantidade) &&
                this.eConfortavelParaAnimaisExistentes(recinto, especie, tipoAnimal, quantidade)
            ) {
                const espacoRestante = espacoDisponivel - (especie.tamanho * quantidade);
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoRestante} total: ${recinto.tamanho})`);
            }
        }

        // Retorna a lista de recintos viáveis ou um erro caso nenhum seja encontrado
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        // Ordena recintos viáveis pelo número do recinto
        recintosViaveis.sort((a, b) => a.split(' ')[1] - b.split(' ')[1]);
        return { recintosViaveis };
    }

    // Calcula o espaço ocupado no recinto considerando os animais presentes e regras de convivência
    calcularEspacoOcupado(recinto) {
        let espaco = 0;
        recinto.animais.forEach(animal => {
            const especie = this.animais[animal.especie];
            espaco += especie.tamanho * animal.quantidade;
        });

        // Regra 6: Se há mais de uma espécie, conta 1 espaço extra ocupado
        if (recinto.animais.length > 1) {
            espaco += 1;
        }

        return espaco;
    }

    // Verifica se o bioma do recinto é adequado para a espécie
    eBiomaAdequado(recinto, especie) {
        return especie.biomas.includes(recinto.bioma) || (recinto.bioma.includes('savana') && especie.biomas.includes('savana e rio'));
    }

    // Verifica se animais carnívoros podem coabitar com outras espécies
    eCarnivoroAdequado(recinto, tipoAnimal) {
        const especie = this.animais[tipoAnimal];
        if (!especie.carnivoro) return true;
        return recinto.animais.every(a => a.especie === tipoAnimal);
    }

    // Verifica se há espaço suficiente no recinto para os novos animais
    eEspacoSuficiente(espacoDisponivel, tamanhoAnimal, quantidade) {
        return espacoDisponivel >= tamanhoAnimal * quantidade;
    }

    // Verifica se animais existentes continuam confortáveis após adição dos novos animais
    eConfortavelParaAnimaisExistentes(recinto, especie, tipoAnimal, quantidade) {
        // Regras específicas de conforto
        const jaPossuiHipopotamo = recinto.animais.some(a => a.especie === 'HIPOPOTAMO');
        const novoHipopotamo = tipoAnimal === 'HIPOPOTAMO';
        const conviveComOutrasEspecies = jaPossuiHipopotamo || novoHipopotamo;
        if ((jaPossuiHipopotamo || novoHipopotamo) && recinto.bioma !== 'savana e rio') {
            return false;
        }

        // Regra específica dos macacos
        if (tipoAnimal === 'MACACO' && recinto.animais.length === 0 && quantidade < 2) {
            return false;
        }

        return true;
    }
}

// Exemplo de uso
const zoologico = new RecintosZoo();
console.log(zoologico.analisaRecintos('UNICORNIO', 1));
console.log(zoologico.analisaRecintos('MACACO', 0));    
console.log(zoologico.analisaRecintos('MACACO', 2));
console.log(zoologico.analisaRecintos('CROCODILO', 1));