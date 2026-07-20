<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		/** Path to a (binary or ASCII) .stl file, e.g. `/models/part.stl` */
		src: string;
		caption?: string;
		height?: number;
		color?: string;
	}

	let { src, caption, height = 420, color = '#f59551' }: Props = $props();

	let container: HTMLDivElement;
	let status = $state<'loading' | 'ready' | 'error'>('loading');

	onMount(() => {
		let disposed = false;
		let cleanup = () => {};

		// three.js is heavy, so it is imported lazily on the client only;
		// the page itself stays prerenderable.
		(async () => {
			try {
				const THREE = await import('three');
				const [{ STLLoader }, { OrbitControls }] = await Promise.all([
					import('three/addons/loaders/STLLoader.js'),
					import('three/addons/controls/OrbitControls.js')
				]);
				if (disposed) return;

				const width = container.clientWidth;
				const scene = new THREE.Scene();
				const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
				const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
				renderer.setSize(width, height);
				renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
				// eslint-disable-next-line svelte/no-dom-manipulating -- three.js owns the canvas inside this container
				container.appendChild(renderer.domElement);

				scene.add(new THREE.AmbientLight(0xffffff, 0.6));
				const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
				keyLight.position.set(1, 2, 3);
				scene.add(keyLight);
				const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
				fillLight.position.set(-2, -1, -2);
				scene.add(fillLight);

				const geometry = await new STLLoader().loadAsync(src);
				if (disposed) return;

				geometry.center();
				geometry.computeBoundingSphere();
				const radius = geometry.boundingSphere?.radius ?? 1;

				const mesh = new THREE.Mesh(
					geometry,
					new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.15 })
				);
				scene.add(mesh);

				camera.position.set(radius * 2.2, radius * 1.6, radius * 2.2);
				const controls = new OrbitControls(camera, renderer.domElement);
				controls.enableDamping = true;
				controls.autoRotate = true;
				controls.autoRotateSpeed = 1.5;

				renderer.setAnimationLoop(() => {
					controls.update();
					renderer.render(scene, camera);
				});

				const onResize = () => {
					const w = container.clientWidth;
					camera.aspect = w / height;
					camera.updateProjectionMatrix();
					renderer.setSize(w, height);
				};
				window.addEventListener('resize', onResize);

				status = 'ready';
				cleanup = () => {
					window.removeEventListener('resize', onResize);
					renderer.setAnimationLoop(null);
					controls.dispose();
					geometry.dispose();
					renderer.dispose();
					renderer.domElement.remove();
				};
			} catch (err) {
				console.error('StlViewer failed to load model', err);
				status = 'error';
			}
		})();

		return () => {
			disposed = true;
			cleanup();
		};
	});
</script>

<figure class="not-prose my-8">
	<div
		bind:this={container}
		class="relative w-full overflow-hidden rounded-box border border-base-300/60 bg-base-200 shadow-md"
		style="height: {height}px"
	>
		{#if status === 'loading'}
			<div class="absolute inset-0 flex items-center justify-center">
				<span class="loading loading-lg loading-spinner text-primary"></span>
			</div>
		{:else if status === 'error'}
			<div class="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
				<p class="font-mono text-sm">Could not load the 3D model 😞</p>
				<a class="link text-sm" href={src} download>Download the STL instead</a>
			</div>
		{/if}
	</div>
	<figcaption class="mt-3 text-center font-mono text-sm text-base-content/60">
		{caption ?? 'Drag to rotate · scroll to zoom'}
	</figcaption>
</figure>
