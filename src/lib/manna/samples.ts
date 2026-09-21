import type { ConfidenceLevel } from "./types";

export type SampleSource = {
  title: string;
  confidenceLevel: ConfidenceLevel;
  lensTags: string[];
  text: string;
};

export const SAMPLE_LIBRARY: SampleSource[] = [
  {
    title: "Gospel of John 1:1–18",
    confidenceLevel: "primary",
    lensTags: ["christian", "primary"],
    text: `In the beginning was the Word, and the Word was with God, and the Word was God. He was in the beginning with God. All things were made through him, and without him was not any thing made that was made. In him was life, and the life was the light of men. The light shines in the darkness, and the darkness has not overcome it.

There was a man sent from God, whose name was John. He came as a witness, to bear witness about the light, that all might believe through him. He was not the light, but came to bear witness about the light.

The true light, which gives light to everyone, was coming into the world. He was in the world, and the world was made through him, yet the world did not know him. He came to his own, and his own people did not receive him. But to all who did receive him, who believed in his name, he gave the right to become children of God, who were born, not of blood nor of the will of the flesh nor of the will of man, but of God.

And the Word became flesh and dwelt among us, and we have seen his glory, glory as of the only Son from the Father, full of grace and truth. (John bore witness about him, and cried out, “This was he of whom I said, ‘He who comes after me ranks before me, because he was before me.’”) For from his fullness we have all received, grace upon grace. For the law was given through Moses; grace and truth came through Jesus Christ. No one has ever seen God; the only God, who is at the Father’s side, he has made him known.`,
  },
  {
    title: "Gospel of Thomas, selected logia",
    confidenceLevel: "primary",
    lensTags: ["gnostic", "christian", "primary"],
    text: `These are the secret sayings which the living Jesus spoke and which Didymos Judas Thomas wrote down.

(1) And he said, “Whoever finds the interpretation of these sayings will not experience death.”

(2) Jesus said, “Let him who seeks continue seeking until he finds. When he finds, he will become troubled. When he becomes troubled, he will be astonished, and he will rule over the All.”

(3) Jesus said, “If those who lead you say to you, ‘See, the kingdom is in the sky,’ then the birds of the sky will precede you. If they say to you, ‘It is in the sea,’ then the fish will precede you. Rather, the kingdom is inside of you, and it is outside of you. When you come to know yourselves, then you will become known, and you will realize that it is you who are the sons of the living Father. But if you will not know yourselves, you dwell in poverty and it is you who are that poverty.”

(13) Jesus said to his disciples, “Compare me to someone and tell me whom I am like.” Simon Peter said to him, “You are like a righteous angel.” Matthew said to him, “You are like a wise philosopher.” Thomas said to him, “Master, my mouth is wholly incapable of saying whom you are like.” Jesus said, “I am not your master. Because you have drunk, you have become intoxicated from the bubbling spring which I have measured out.”

(50) Jesus said, “If they say to you, ‘Where did you come from?’, say to them, ‘We came from the light, the place where the light came into being on its own accord and established itself and became manifest through their image.’ If they say to you, ‘Is it you?’, say, ‘We are its children, we are the elect of the living Father.’ If they ask you, ‘What is the sign of your father in you?’, say to them, ‘It is movement and repose.’”

(77) Jesus said, “It is I who am the light which is above them all. It is I who am the all. From me did the all come forth, and unto me did the all extend. Split a piece of wood, and I am there. Lift up the stone, and you will find me there.”

(113) His disciples said to him, “When will the kingdom come?” Jesus said, “It will not come by waiting for it. It will not be a matter of saying ‘here it is’ or ‘there it is.’ Rather, the kingdom of the Father is spread out upon the earth, and men do not see it.”`,
  },
  {
    title: "Dhammapada 1 — The Twin Verses",
    confidenceLevel: "primary",
    lensTags: ["buddhist", "primary"],
    text: `Mind precedes all mental states. Mind is their chief; they are all mind-wrought. If with an impure mind a person speaks or acts, suffering follows him like the wheel that follows the foot of the ox.

Mind precedes all mental states. Mind is their chief; they are all mind-wrought. If with a pure mind a person speaks or acts, happiness follows him like his never-departing shadow.

“He abused me, he struck me, he overpowered me, he robbed me.” Those who harbor such thoughts do not still their hatred.

“He abused me, he struck me, he overpowered me, he robbed me.” Those who do not harbor such thoughts still their hatred.

Hatred is never appeased by hatred in this world. By non-hatred alone is hatred appeased. This is a law eternal.

There are those who do not realize that one day we all must die. But those who do realize this settle their quarrels.

Just as a storm throws down a weak tree, so does Mara overpower the man who lives for the pursuit of pleasures, who is uncontrolled in his senses, immoderate in eating, indolent, and dissipated.

Just as a storm cannot prevail against a rocky mountain, so Mara can never overpower the man who lives meditating on the impurities, who is controlled in his senses, moderate in eating, and filled with faith and earnest effort.

Whoever holds himself dear should cultivate wholesome states. The wise one should watch over himself during one of the three watches of the night.

The fool who knows his foolishness is wise at least to that extent; but the fool who thinks himself wise is a fool indeed.`,
  },
  {
    title: "Plato, Republic VII — The Cave",
    confidenceLevel: "primary",
    lensTags: ["philosophical", "primary"],
    text: `Next, said I, compare the effect of education and of the lack of it upon our nature to a condition like the following: imagine human beings living in an underground cave-like dwelling, with a long entrance reaching up toward the light along the whole width of the cave. They have been there from childhood, with their necks and legs in bonds, so that they remain in the same place and see only in front of them, unable to turn their heads because of the bond. Light reaches them from a fire burning far above and behind them. Between the fire and the prisoners, there is a path along which a low wall has been built, like the screen in front of puppeteers above which they show their puppets.

See also, then, men along this wall carrying all kinds of artifacts, which project above the wall — statues of men and other animals, made of stone and wood and all kinds of materials. And as is likely, some of the carriers utter sounds while others are silent.

They are like us, I said. For in the first place, do you think such men would have seen anything of themselves or of one another except the shadows cast by the fire on the wall of the cave in front of them?

How could they, he said, if they were compelled to keep their heads motionless throughout life?

And what about the things carried along the wall? Would they not see only the shadows of those?

Yes, certainly.

If they could converse with one another, do you not think they would suppose that the names they used applied to the things they see passing before them?

They would have to.

And if their prison also had an echo from the wall opposite them, whenever one of the carriers uttered a sound, do you think they would believe that the passing shadow was the speaker?

By Zeus, I do.

Then in every way such prisoners would consider the truth to be nothing other than the shadows of the artifacts.

And if one of them were freed and suddenly compelled to stand up, turn his neck, and walk toward the light, he would suffer pain, and because of the dazzle he would be unable to see the things whose shadows he had seen before. And if someone dragged him by force up the rough, steep path and did not let him go until he had dragged him into the light of the sun, would he not be pained and irritated at being so dragged? And when he came into the light, would his eyes not be filled with its beam, so that he would not be able to see even one of the things now said to be the true ones?

He would need, I think, to become accustomed before he could see things in the world above. At first he would most easily see shadows, then the images of men and other things in water, then the things themselves. From there he would go on to the things in heaven and heaven itself, looking at the light of the stars and the moon more easily than at the sun and its light by day.

Last of all he would be able to see the sun — not its appearances in water or in some alien place, but the sun itself, in its own region, and be able to contemplate it as it is.

And after that he would already be able to conclude about it that this is what provides the seasons and the years, and is the steward of all things in the visible region, and is in a certain way the cause of all those things they used to see.

If he recalled his first dwelling, and the wisdom there, and his fellow prisoners, do you not think he would consider himself happy for the change and pity them?`,
  },
];
