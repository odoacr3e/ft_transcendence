<script setup>
	import { useAuthStore } from "../stores/auth.st";
	import { useRouter }	from 'vue-router';
	import { ref }			from 'vue';

	const formData = ref({
		name: '',
		surname: '',
		email: '',
		username: '',
		password: '',
		nationality: ''
	});
	const	visible = ref(false),
			router = useRouter();

	async function submitForm() {
		const auth = useAuthStore();
		await auth.register(formData.value);
		router.push('/');
	}

	function asset(path) {
		return new URL(path, import.meta.url).href;
	}

	function show() { visible.value = !visible.value; }
</script>

<template>
	<!-- <datalist id="country" class="max-h-50">
		<datalist id="country">
		<option value="Afghanistan" />
		<option value="Albania" />
		<option value="Algeria" />
		<option value="Samoa Americane" />
		<option value="Andorra" />
		<option value="Angola" />
		<option value="Anguilla" />
		<option value="Antartide" />
		<option value="Antigua e Barbuda" />
		<option value="Argentina" />
		<option value="Armenia" />
		<option value="Aruba" />
		<option value="Australia" />
		<option value="Austria" />
		<option value="Azerbaigian" />
		<option value="Bahamas" />
		<option value="Bahrein" />
		<option value="Bangladesh" />
		<option value="Barbados" />
		<option value="Bielorussia" />
		<option value="Belgio" />
		<option value="Belize" />
		<option value="Benin" />
		<option value="Bermuda" />
		<option value="Bhutan" />
		<option value="Bolivia" />
		<option value="Bosnia ed Erzegovina" />
		<option value="Botswana" />
		<option value="Isola Bouvet" />
		<option value="Brasile" />
		<option value="Territorio Britannico dell'Oceano Indiano" />
		<option value="Brunei" />
		<option value="Bulgaria" />
		<option value="Burkina Faso" />
		<option value="Burundi" />
		<option value="Cambogia" />
		<option value="Camerun" />
		<option value="Canada" />
		<option value="Capo Verde" />
		<option value="Isole Cayman" />
		<option value="Repubblica Centrafricana" />
		<option value="Ciad" />
		<option value="Cile" />
		<option value="Cina" />
		<option value="Isola Christmas" />
		<option value="Isole Cocos (Keeling)" />
		<option value="Colombia" />
		<option value="Comore" />
		<option value="Congo" />
		<option value="Congo, Repubblica Democratica del" />
		<option value="Isole Cook" />
		<option value="Costa Rica" />
		<option value="Costa d'Avorio" />
		<option value="Croazia" />
		<option value="Cuba" />
		<option value="Cipro" />
		<option value="Repubblica Ceca" />
		<option value="Danimarca" />
		<option value="Gibuti" />
		<option value="Dominica" />
		<option value="Repubblica Dominicana" />
		<option value="Ecuador" />
		<option value="Egitto" />
		<option value="El Salvador" />
		<option value="Guinea Equatoriale" />
		<option value="Eritrea" />
		<option value="Estonia" />
		<option value="Etiopia" />
		<option value="Isole Falkland (Malvinas)" />
		<option value="Isole Faroe" />
		<option value="Figi" />
		<option value="Finlandia" />
		<option value="Francia" />
		<option value="Guyana Francese" />
		<option value="Polinesia Francese" />
		<option value="Terre Australi e Antartiche Francesi" />
		<option value="Gabon" />
		<option value="Gambia" />
		<option value="Georgia" />
		<option value="Germania" />
		<option value="Ghana" />
		<option value="Gibilterra" />
		<option value="Grecia" />
		<option value="Groenlandia" />
		<option value="Grenada" />
		<option value="Guadalupa" />
		<option value="Guam" />
		<option value="Guatemala" />
		<option value="Guinea" />
		<option value="Guinea-Bissau" />
		<option value="Guyana" />
		<option value="Haiti" />
		<option value="Isole Heard e McDonald" />
		<option value="Santa Sede (Città del Vaticano)" />
		<option value="Honduras" />
		<option value="Hong Kong" />
		<option value="Ungheria" />
		<option value="Islanda" />
		<option value="India" />
		<option value="Indonesia" />
		<option value="Iran" />
		<option value="Iraq" />
		<option value="Irlanda" />
		<option value="Italia" />
		<option value="Giamaica" />
		<option value="Giappone" />
		<option value="Giordania" />
		<option value="Kazakistan" />
		<option value="Kenya" />
		<option value="Kiribati" />
		<option value="Corea del Nord" />
		<option value="Corea del Sud" />
		<option value="Kuwait" />
		<option value="Kirghizistan" />
		<option value="Laos" />
		<option value="Lettonia" />
		<option value="Libano" />
		<option value="Lesotho" />
		<option value="Liberia" />
		<option value="Libia" />
		<option value="Liechtenstein" />
		<option value="Lituania" />
		<option value="Lussemburgo" />
		<option value="Macao" />
		<option value="Macedonia del Nord" />
		<option value="Madagascar" />
		<option value="Malawi" />
		<option value="Malesia" />
		<option value="Maldive" />
		<option value="Mali" />
		<option value="Malta" />
		<option value="Isole Marshall" />
		<option value="Martinica" />
		<option value="Mauritania" />
		<option value="Mauritius" />
		<option value="Mayotte" />
		<option value="Messico" />
		<option value="Micronesia" />
		<option value="Moldova" />
		<option value="Monaco" />
		<option value="Mongolia" />
		<option value="Montserrat" />
		<option value="Marocco" />
		<option value="Mozambico" />
		<option value="Myanmar" />
		<option value="Namibia" />
		<option value="Nauru" />
		<option value="Nepal" />
		<option value="Paesi Bassi" />
		<option value="Antille Olandesi" />
		<option value="Nuova Caledonia" />
		<option value="Nuova Zelanda" />
		<option value="Nicaragua" />
		<option value="Niger" />
		<option value="Nigeria" />
		<option value="Niue" />
		<option value="Isola Norfolk" />
		<option value="Isole Marianne Settentrionali" />
		<option value="Norvegia" />
		<option value="Oman" />
		<option value="Pakistan" />
		<option value="Palau" />
		<option value="Palestina" />
		<option value="Panama" />
		<option value="Papua Nuova Guinea" />
		<option value="Paraguay" />
		<option value="Perù" />
		<option value="Filippine" />
		<option value="Pitcairn" />
		<option value="Polonia" />
		<option value="Portogallo" />
		<option value="Porto Rico" />
		<option value="Qatar" />
		<option value="Riunione" />
		<option value="Romania" />
		<option value="Federazione Russa" />
		<option value="Ruanda" />
		<option value="Sant'Elena" />
		<option value="Saint Kitts e Nevis" />
		<option value="Santa Lucia" />
		<option value="Saint Pierre e Miquelon" />
		<option value="Saint Vincent e Grenadine" />
		<option value="Samoa" />
		<option value="San Marino" />
		<option value="São Tomé e Príncipe" />
		<option value="Arabia Saudita" />
		<option value="Senegal" />
		<option value="Serbia e Montenegro" />
		<option value="Seychelles" />
		<option value="Sierra Leone" />
		<option value="Singapore" />
		<option value="Slovacchia" />
		<option value="Slovenia" />
		<option value="Isole Salomone" />
		<option value="Somalia" />
		<option value="Sudafrica" />
		<option value="Georgia del Sud e Isole Sandwich Australi" />
		<option value="Spagna" />
		<option value="Sri Lanka" />
		<option value="Sudan" />
		<option value="Suriname" />
		<option value="Svalbard e Jan Mayen" />
		<option value="Swaziland" />
		<option value="Svezia" />
		<option value="Svizzera" />
		<option value="Siria" />
		<option value="Taiwan" />
		<option value="Tagikistan" />
		<option value="Tanzania" />
		<option value="Thailandia" />
		<option value="Timor Est" />
		<option value="Togo" />
		<option value="Tokelau" />
		<option value="Tonga" />
		<option value="Trinidad e Tobago" />
		<option value="Tunisia" />
		<option value="Turchia" />
		<option value="Turkmenistan" />
		<option value="Isole Turks e Caicos" />
		<option value="Tuvalu" />
		<option value="Uganda" />
		<option value="Ucraina" />
		<option value="Emirati Arabi Uniti" />
		<option value="Regno Unito" />
		<option value="Stati Uniti" />
		<option value="Isole Minori Esterne degli Stati Uniti" />
		<option value="Uruguay" />
		<option value="Uzbekistan" />
		<option value="Vanuatu" />
		<option value="Venezuela" />
		<option value="Vietnam" />
		<option value="Isole Vergini Britanniche" />
		<option value="Isole Vergini Americane" />
		<option value="Wallis e Futuna" />
		<option value="Sahara Occidentale" />
		<option value="Yemen" />
		<option value="Zambia" />
		<option value="Zimbabwe" />
	</datalist>
	</datalist> -->
	<div class="justify-self-center justify-items-center mt-3">
		<form @submit.prevent="submitForm" method="post" enctype="application/json" class="text-white" target="_blank">
			<div class="form flex w-sm mb-3">
				<img src="../assets/UserIcon.png" alt="" class="size-6" >
				<input placeholder="Nome" size="35" class="pl-2 text-base" autofocus="true" type="text" v-model="formData.name">
			</div>
			<div class="form flex w-sm mb-3">
				<img src="../assets/UserIcon.png" alt="" class="size-6" >
				<input placeholder="Cognome" size="35" class="pl-2 text-base" autofocus="true" type="text" v-model="formData.surname">
			</div>
			<div class="form flex w-sm mb-3">
				<img src="../assets/UserIcon.png" alt="" class="size-6" >
				<input placeholder="Nome utente" size="35" class="pl-2 text-base" autofocus="true" type="text" v-model="formData.username">
			</div>
			<div class="form flex w-sm mb-3">
				<img src="../assets/Email.png" alt="" class="size-6" >
				<input placeholder="Email" size="35" class="pl-2 text-base" autofocus="true" type="email" v-model="formData.email">
			</div>
			<div class="mb-2.5">
				<div class="form flex w-sm mb-0.5">
					<img src="../assets/PasswordIcon.png" alt="" class="size-6">
					<input placeholder="Password" size="31" class="pl-2 text-base" :type="visible ? 'text' : 'password'" v-model="formData.password">
					<button type="button" @click="show()" class="ml-3">
						<img class="size-5" :src="visible ? asset('../assets/EyeClose.png') : asset('../assets/EyeOpen.png')" alt="">
					</button>
				</div>
			</div>
			<div class="form flex w-sm mb-3">
				<img src="../assets/World.png" alt="" class="size-6" >
				<input placeholder="Nazionalita'" list="country" size="35" class="pl-2 text-base" autofocus="true" type="text" v-model="formData.nationality">
			</div>
			<input id="submit" class="cursor-pointer justify-self-center w-sm mt-1.5 p-3 text-base bg-[#882a2a] rounded-[7px] text-white hover:bg-linear-to-t from-[#882a2a] to-[#af3d3d]"
					v-bind:class="{'pointer-events-none grayscale': !formData.name || !formData.surname || !formData.username || !formData.email || !formData.password || !formData.nationality,
						'pointer-events-auto grayscale-0 ': formData.name && formData.surname && formData.username && formData.email && formData.password && formData.nationality }"
					type="submit" value="Registrati">
		</form>
	</div>
</template>

<style scoped>
	div.form {
		padding: 10px;
		border-width: 1px;
		border-radius: 7px;
		border-color: #4e4e4e8c;
		color: #dcdfe4c0;
		justify-self: center;
	}

	div.form:focus-within {
		border-color: #f1e8e8af;
	}

	div.form:hover {
		border-color: #f1e8e8af;
		animation: hover 0.4s ease-in-out ;
	}

	input:focus {
		outline: 0;
	}

	#submit {
		transition: filter 0.2s ease-in-out;
	}
</style>