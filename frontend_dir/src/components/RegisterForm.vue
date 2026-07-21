<script setup>
	import { useAuthStore } from "../stores/auth.st";
	import { useRouter }	from 'vue-router';
	import { ref, reactive }			from 'vue';

	const formData = ref({
		name: '',
		surname: '',
		email: '',
		username: '',
		password: '',
		nationality: ''
	});
	const	auth = useAuthStore(),
			visible = ref(false),
			error = reactive({
				clone: [false, false],		//[0] == shake, [1] == card
				username: [false, false],
				email: [false, false],
				password: [false, false],
			}),
			error_msg = {
				clone: "Esiste gia' un utente\ncon queste credenziali",
				username: "Lo username deve avere\nalmeno 4 caratteri",
				email: "Controlla di aver\ninserito un email valida",
				password: "La password deve avere:\n\
							- almeno 8 caratteri\n- un numero\n\
							- una maiuscola\n- una minuscola\n\
							- un carattere speciale ($,%,#...)"
			},
			router = useRouter();
	let		resp = ref(null);

	function resetError() {
		error.clone[1] = false;
		error.username[1] = false;
		error.email[1] = false;
		error.password[1] = false;
	}

	async function submitForm() {
		resp.value = await auth.register(formData.value);
		resetError();
		if (!resp.value)	{ router.push('/me'); }
		else {
			switch (resp.value) {
				case "User already exists":
					error.clone.fill(true)
					break;
				case "Username too short":
					error.username.fill(true)
					break;
				case "Invalid email format":
					error.email.fill(true)
					break;
				case "Invalid password format":
					error.password.fill(true)
					break;
				default:
					break;
			}
		}
	}

	function show() { visible.value = !visible.value; }
</script>

<template>
	<datalist id="country" class="max-h-50">
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
	</datalist>
	<div>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" id="allert"
			class="absolute size-6 text-red-100 animate-error -translate-x-3 hidden transition-all duration-250 ease-in-out"
			:class="{	'inline translate-y-34.5' : error.username[1] || error.clone[1],
						'inline translate-y-49' : error.email[1],
						'inline translate-y-63.5' : error.password[1],
			}">
			<path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
		</svg>
		<div class="hidden -translate-x-25 p-3 animate-pop flex-col items-center text-center
				gap-2.5 absolute rounded-xl border inset-ring bg-[#2f1818]/80 text-red-100 border-red-800/10 inset-ring-red-500/20"
			:class="{	'translate-y-24.5 -translate-x-52 inline' : error.clone[1], 
						'translate-y-24.5 -translate-x-55' : error.username[1], 
						'translate-y-39 -translate-x-52' : error.email[1],
						'translate-y-53.5 -translate-x-69' : error.password[1],
			}">	
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-red-100 self-center mx-auto">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
			</svg>
			<div>
				<h2>Credenziali errate</h2>
				<p class="text-sm whitespace-pre-line" v-if="error.username[1]">{{ error_msg.username }}</p>
				<p class="text-sm whitespace-pre-line" v-if="error.clone[1]">{{ error_msg.clone }}</p>
				<p class="text-sm whitespace-pre-line" v-if="error.email[1]">{{ error_msg.email }}</p>
				<p class="text-sm whitespace-pre-line" v-if="error.password[1]">{{ error_msg.password }}</p>
				<RouterLink to="/log" v-if="error.clone[1]">
                    <u><a class="text-sm cursor-pointer hover:text-[#af3d3d] active:text-[#d1aaaa]">Vuoi accedere?</a></u>
                </RouterLink>
			</div>
		</div>
	</div>


	<div class="justify-self-center justify-items-center mt-3">
		<form @submit.prevent="submitForm" method="post" enctype="application/json" class="text-white" target="_blank">
			<div class="form flex w-sm mb-3">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
				</svg>
				<input placeholder="Nome" size="35" class="pl-2 text-base" autofocus="true" type="text" v-model="formData.name">
			</div>
			<div class="form flex w-sm mb-3">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
				</svg>
				<input placeholder="Cognome" size="35" class="pl-2 text-base" type="text" v-model="formData.surname">
			</div>
			<div class="form flex w-sm mb-3" :class="{ 'animate-shake': error.username[0] }" @animationend="error.username[0] = false">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
				</svg>
				<input placeholder="Nome utente" size="35" class="pl-2 text-base" type="text" v-model="formData.username">
			</div>
			<div class="form flex w-sm mb-3" :class="{ 'animate-shake': error.email[0] }" @animationend="error.email[0] = false">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
				</svg>
				<input placeholder="Email" size="35" class="pl-2 text-base" type="email" v-model="formData.email">
			</div>
			<div class="form flex w-sm mb-3" :class="{ 'animate-shake': error.password[0] }" @animationend="error.password[0] = false">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
				</svg>
				<input placeholder="Password" size="31" class="pl-2 text-base" :type="visible ? 'text' : 'password'" v-model="formData.password">
				<button type="button" @click="show()" class="ml-3">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 8.155 7.36 5.5 12 5.5c4.638 0 8.573 2.655 9.963 6.428.07.207.07.431 0 .639C20.577 15.845 16.64 18.5 12 18.5c-4.638 0-8.573-2.655-9.963-6.428Z" />
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
						<path v-if="visible" stroke-linecap="round" stroke-linejoin="round" d="M3 3 21 21" />
					</svg>
				</button>
			</div>
			<div class="form flex w-sm mb-3">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="size-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="m20.893 13.393-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236a1.125 1.125 0 0 0 1.302-.795l.208-.73a1.125 1.125 0 0 0-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 0 1-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 0 1-1.458-1.137l1.411-2.353a2.25 2.25 0 0 0 .286-.76m11.928 9.869A9 9 0 0 0 8.965 3.525m11.928 9.868A9 9 0 1 1 8.965 3.525" />
				</svg>
				<input placeholder="Nazionalita'" list="country" size="35" class="pl-2 text-base" type="text" v-model="formData.nationality">
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
		border-color: #f1e8e870;
	}

	div.form:hover {
		border-color: #f1e8e870;
		transition: border 0.25s ease-in-out;
	}

	input:focus {
		outline: 0;
	}

	#submit {
		transition: filter 0.2s ease-in-out;
	}

	#allert:hover + div
	{
		display: inline;
	}

	#allert + div:hover {
		display: inline;
	}
</style>