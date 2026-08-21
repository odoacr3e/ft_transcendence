<script setup>
	import { useAuthStore }	from "../stores/auth.st";
	import { useI18n }		from 'vue-i18n';
	import { ref }			from 'vue';
	import router	from '../router/index.js';

    const	{ t } = useI18n(),
			formData = ref({
			  username: '',
			  password: ''
			}),
			otpData = ref({
			  id_user: '',
			  otp: ''
			}),
			otpValues = ref(['', '', '', '', '', '']),
			authStore = useAuthStore(),
			visible = ref(false), popup = ref(false),
			error = ref(false), error_card = ref(false), error_msg = ref(null),
			resp = ref(null);

	async function submitForm() {
		resp.value = await authStore.login(formData.value);
		if (!resp.value && authStore.isAuthenticated)	{ router.push('/me'); }
		else if (resp.value && resp.value.status === "success" && !authStore.isAuthenticated)
		{
			popup.value = true;
			otpData.value.id_user = resp.value.data.id_user;
		}
		else	{ error.value = true; error_card.value = true; error_msg.value = t('login.err.wrong'); }
	}

	async function submitOtp()
	{
		otpData.value.otp = otpValues.value.join('');
		resp.value = await authStore.mfa(otpData.value);

		if (!resp.value)	{ router.push('/me'); }
		else if (resp.value === "Too many attempts")
		{
			popup.value = false;
			error.value = true;
			error_card.value = true;
			error_msg.value = t('login.err.tooMany');
		}
	}

	const closePopup = () => {
        popup.value = false;
    };

	function show() { visible.value = !visible.value; }

	function handleOtpInput(index, event) {
		const value = event.target.value;
		if (value && /^\d$/.test(value)) // /^\d$/ ^ -> inziio stringa, \d = digit 0-9, $ = fine stringa
		{
			otpValues.value[index] = value;
			if (index < 5)
				setTimeout(() => document.getElementById(`otp-${index + 1}`)?.focus(), 0);
		} 
		else { otpValues.value[index] = ''; }
	}

	function handleOtpKeydown(index, event) {
		if (event.ctrlKey || event.metaKey) return;

		if (!/^\d$/.test(event.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key))
		{
    	    event.preventDefault();
    	    return;
    	}

		if (event.key === 'Backspace')
		{
			if (otpValues.value[index] === '' && index > 0)
			{
				otpValues.value[index - 1] = '';
				setTimeout(() => document.getElementById(`otp-${index - 1}`)?.focus(), 0);
			}
			else
				otpValues.value[index] = '';
		}
		else if (event.key === 'ArrowLeft' && index > 0)	{ document.getElementById(`otp-${index - 1}`)?.focus(); }
		else if (event.key === 'ArrowRight' && index < 5)	{ document.getElementById(`otp-${index + 1}`)?.focus(); }
	}

	function handleOtpPaste(event) {
		event.preventDefault();

		const	pasted = event.clipboardData.getData('text').trim(),
				digits = pasted.replace(/\D/g, '').split(''); // solo le cifre

		if (digits.length === 0)
			return;

		let currentIndex = 0;
		for (let i = 0; i < digits.length && currentIndex < 6; i++) {
			otpValues.value[currentIndex] = digits[i]; // Riempi gli input
			currentIndex++;
		}

		const focusIndex = Math.min(currentIndex, 5);  // focus sull'ultimo campo 
		setTimeout(() => document.getElementById(`otp-${focusIndex}`)?.focus(), 0);
	}
</script>

<template>
	<div v-if="error_card" class="flex gap-2.5 absolute items-center rounded-xl border px-5 py-4 w-93
		translate-x-8 -translate-y-75 animate-card inset-ring bg-bg-error text-text-error border-border-error inset-ring-inset-error">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-text-error">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
		</svg>
		<div>
			<h2>{{ t('login.err.title') }}</h2>
			<p class="text-sm">{{ error_msg }}</p>
		</div>
	</div>
	<div class="justify-self-center justify-items-center">
		<form @submit.prevent="submitForm" method="post" enctype="application/json" class="text-text-default">
			<div class="form border-border-default text-form-icon flex w-sm mb-5" :class="{ 'animate-shake': error }" @animationend="error = false">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
				</svg>
				<input :placeholder="'Username ' + t('common.or', 1) + ' email'" size="35" class="pl-2 text-base" autofocus="true" type="text" v-model="formData.username">
			</div>
			<div class="mb-4.5">
				<div class="form border-border-default text-form-icon flex w-sm mb-0.5" :class="{ 'animate-shake': error }" @animationend="error = false">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
					</svg>
					<input placeholder="Password" size="31" class="pl-2 text-base" v-model="formData.password"
							:type="visible ? 'text' : 'password'">
					<button type="button" @click="show()" class="ml-3">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
							<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 8.155 7.36 5.5 12 5.5c4.638 0 8.573 2.655 9.963 6.428.07.207.07.431 0 .639C20.577 15.845 16.64 18.5 12 18.5c-4.638 0-8.573-2.655-9.963-6.428Z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
							<path v-if="visible" stroke-linecap="round" stroke-linejoin="round" d="M3 3 21 21" />
						</svg>

					</button>
				</div>
				<RouterLink to="/DEBUG/pwd">
					<u><a class="justify-self-center text-[80%] text-main-color cursor-pointer hover:text-light-button active:text-active-button">{{ t('login.forgot') }}</a></u>
                </RouterLink>
			</div>
			<input id="submit" class="cursor-pointer justify-self-center w-sm mt-1.5 p-3 text-base bg-main-color rounded-[7px] text-text-default hover:bg-linear-to-t from-main-color to-light-button"
					v-bind:class="{'pointer-events-none grayscale': !formData.username || !formData.password,
						'pointer-events-auto grayscale-0 ': formData.username && formData.password }"        
					type="submit" :value="t('header.login')">
		</form>
	</div>

	<div v-if="popup" class="fixed inset-0 z-50 flex items-center justify-center bg-bg-blur backdrop-blur-xs px-4">
        <div class="w-full max-w-lg rounded-3xl border border-border-default bg-bg-default p-6 text-text-default shadow-2xl">
            <div class="flex items-start justify-between gap-4">
                <p class="text-sm uppercase tracking-widest text-text-second">{{ t('login.OTP.auth') }}</p>
				<button type="button" class="text-2xl leading-none text-text-third hover:text-text-default" @click="closePopup">&times;</button>
            </div>
			<hr class="w-[90%] justify-self-start text-text-last mt-1 mb-2">
			<div class="justify-self-center mt-4">
				<p class="text-sm justify-self-center">{{ t('login.OTP.desc') }}</p>
				<p class="text-sm justify-self-center mb-2">{{ t('login.OTP.auth', {date: resp.data.Expiration}) }}</p>
				<form @submit.prevent="submitOtp" class="justify-self-center">
					<div class="flex">
						<div v-for="(digit, index) in otpValues" :key="`otp-${index}`" class="otp" id="otpContainer">
							<input type="text" class="otp-input" maxlength="1"
									:id="`otp-${index}`" :value="digit" :autofocus="index === 0"
									@input="handleOtpInput(index, $event)" @keydown="handleOtpKeydown(index, $event)" @paste="handleOtpPaste($event)">
						</div>
					</div>
					<input id="submit" type="submit" value="Accedi"
						class="cursor-pointer justify-self-center w-full my-3 p-3 text-base bg-main-color rounded-[7px] text-text-default hover:bg-linear-to-t from-main-color to-light-button"
						:class="{	'pointer-events-none grayscale': otpValues.some(v => !v), 
									'pointer-events-auto grayscale-0': otpValues.every(v => v) }">
				</form>
			</div>
		</div>
    </div>
</template>

<style scoped>
	div.form {
		padding: 15px;
		border-width: 1px;
		border-radius: 7px;
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

	.otp {
	    display: flex;
	    gap: 15px;
	    justify-content: center;
		margin: 5px;
		padding: 15px;
		border-width: 1px;
		border-radius: 7px;
		border-color: var(--color-border-default);
		color: var(--color-form-icon);
		justify-self: center;
	}

	.otp input {
	    width: 20px;
	    height: 30px;
	    border: none;
	    outline: none;
	    font-size: 28px;
	    text-align: center;
	    transition: 0.3s;
	}

	div.otp:focus-within {
		border-color: #f1e8e870;
	}

	div.otp:hover {
		border-color: #f1e8e870;
		transition: border 0.25s ease-in-out;
	}
</style>