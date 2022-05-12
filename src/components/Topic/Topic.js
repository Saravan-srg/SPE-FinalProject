import React, { useState, useEffect, useContext } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Spinner from "react-bootstrap/Spinner";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Badge from "react-bootstrap/Badge";
import Fade from "react-reveal/Fade";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "./Topic.css";
import { ThemeContext } from "../../App";
import Button from "react-bootstrap/Button";

export default function Topic({ data, updateData }) {
	/*
	  This component takes data releted to a paticular topic 
	  and updateData() from App component
	*/
	/*
	  Setting state for fields that comes from `data` prop 
	  so that `data` prop is not undefined on reload
	*/
	const [select, setSelected] = useState([]);
	const [questionsTableData, setQuestionsTableData] = useState([]);
	const [topicName, setTopicName] = useState("");

	const dark = useContext(ThemeContext);
	// updating states using useEffect with dependency  on `data` prop
	


	useEffect(() => {
		if (data !== undefined) {
			let doneQuestion = [];

			let tableData = data.questions.map((question, index) => {
				if (question.Done) {
					doneQuestion.push(index);
				}
				/*
				|	Hidden properties `_is_selected` and `_search_text` are used to sort the table
				|	and search the table respectively. react-bootstrap-table does not allow sorting
				|	by selectRow by default, and requires plain text to perform searches.
				*/
				return {
					id: index,
					question: (
						<>
							
							<span target="_blank"
								rel="noopener noreferrer"
								style={{ fontWeight: "600", fontSize: "20px" }}
								>
								{question.Problem}
							</span>
							<button onClick={()=> window.open(question.URL, "__blank")} class="btn btn-link float-right">Link</button>

				
						</>
					),

					_is_selected: question.Done,
					_search_text: question.Problem,
				};
			});
			setQuestionsTableData(tableData);
			setTopicName(data.topicName);
			setSelected(doneQuestion);
		}
	}, [data]);

	//tooltip functions
	const renderTooltipView = (props) => (
		<Tooltip {...props} className="in" id="button-tooltip">
			View Notes
		</Tooltip>
	);

	const renderTooltipAdd = (props) => (
		<Tooltip {...props} className="in" id="button-tooltip">
			Add Notes
		</Tooltip>
	);

	//seacrh bar config
	const SearchBar = (props) => {
		const handleChange = (e) => {
			props.onSearch(e.target.value);
		};
		return (
			<div className="topic-input-container">
				<div className="container">
					<InputGroup className="mb-4">
						<InputGroup.Append>
							<RandomButton data={data} />
						</InputGroup.Append>
						
						<InputGroup.Prepend>
							<Badge
								variant="success"
								style={{ borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px", background: "rgb(200, 230, 201)" }}
							>
								<p className="completed-questions" style={{ color: "black", padding: "8px" }}>
									<span style={{ fontWeight: "bold" }}>
										{data.doneQuestions}/{data.questions.length}
									</span>{" "}
									Done{" "}
									<span className="emojiFix" role="img" aria-label="checker">
										&#9989;
									</span>
								</p>
							</Badge>
						</InputGroup.Prepend>
					</InputGroup>
				</div>
			</div>
		);
	};
	// // table config
	const columns = [
		{
			dataField: "question",
			text: "Questions",
			headerStyle: { fontSize: "20px", textAlign: "center" },
		},
		{
			dataField: "_is_selected",
			text: "Is Selected",
			headerStyle: { fontSize: "20px" },
			hidden: true,
			sort: true,
		},
		{
			dataField: "_search_text",
			text: "Search Text",
			headerStyle: { fontSize: "20px" },
			hidden: true,
		},
	];
	const rowStyle = { fontSize: "20px" };
	const selectRow = {
		mode: "checkbox",
		style: { background: dark ? "#393E46" : "#c8e6c9", fontSize: "24px" },
		selected: select,
		onSelect: handleSelect,
		hideSelectAll: true,
	};
	const sortMode = {
		dataField: "_is_selected",
		order: "asc",
	};

	// func() triggered when a question is marked done
	function handleSelect(row, isSelect) {
		let key = topicName.replace(/[^A-Z0-9]+/gi, "_").toLowerCase();
		let newDoneQuestion = [...select];
		let updatedQuestionsStatus = data.questions.map((question, index) => {
			if (row.id === index) {
				question.Done = isSelect;
				if (isSelect) {
					newDoneQuestion.push(row.id);
				} else {
					var pos = newDoneQuestion.indexOf(row.id);
					newDoneQuestion.splice(pos, 1);
				}
				return question;
			} else {
				return question;
			}
		});
		updateData(
			key,
			{
				started: newDoneQuestion.length > 0 ? true : false,
				doneQuestions: newDoneQuestion.length,
				questions: updatedQuestionsStatus,
			},
			data.position
		);
		//displayToast(isSelect, row.id);
	}

	

	//Notes component
	const NoteSection = (props) => {
		let id = localStorage.getItem("cid");

		const [quickNotes, setQuickNotes] = useState(data.questions[id]?.Notes);
		const addnewnotes = (event) => {
			setQuickNotes(event.target.value);
		};

		const onadd = () => {
			let key = topicName.replace(/[^A-Z0-9]+/gi, "_").toLowerCase();
			// let id = localStorage.getItem("cid");
			if (id) {
				let que = data.questions;
				que[id].Notes = quickNotes.trim().length === 0 ? "" : quickNotes.trim();
				updateData(
					key,
					{
						started: data.started,
						doneQuestions: data.doneQuestions,
						questions: que,
					},
					data.position
				);
				localStorage.removeItem("cid");
			} else {
				saveAndExitNotes();
			}
		};

		return (
			<>
				<div className="note-area">
					<div className="note-container">
						<div className="question-title" style={{ color: "black" }}></div>
						<textarea maxLength="432" className="note-section" placeholder="your notes here" onChange={addnewnotes}></textarea>
						<div className="button-container">
							<button className="note-exit" onClick={saveAndExitNotes}>
								Close
							</button>
							<button className="note-save" onClick={onadd}>
								Save
							</button>
						</div>
					</div>
				</div>
			</>
		);
	};
	//function for closing notes
	function saveAndExitNotes() {
		document.getElementsByClassName("note-section")[0].style.display = "none";
		document.getElementsByClassName("note-exit")[0].style.display = "none";
		document.getElementsByClassName("note-save")[0].style.display = "none";
		document.getElementsByClassName("note-area")[0].style.display = "none";
		localStorage.removeItem("cid");
	}
	//funtion for taking notes
	function shownotes(ind) {
		document.getElementsByClassName("note-section")[0].style.display = "block";
		document.getElementsByClassName("note-exit")[0].style.display = "block";
		document.getElementsByClassName("note-save")[0].style.display = "block";
		document.getElementsByClassName("note-area")[0].style.display = "block";

		localStorage.setItem("cid", ind);
		document.getElementsByClassName("note-section")[0].value = data.questions[ind].Notes;
		document.getElementsByClassName("question-title")[0].innerHTML = data.questions[ind].Problem;
	}
	return (
		<>
			<h3 className="text-center mb-4">
				<Link to="/">Topics</Link>/{topicName}
			</h3>

			{data === undefined ? (
				<div className="d-flex justify-content-center">
					<Spinner animation="grow" variant="success" />
				</div>
			) : (
				<ToolkitProvider
					className="float-right"
					keyField="id"
					data={questionsTableData}
					columns={columns}
					rowStyle={rowStyle}
					search
				>
					{(props) => (
						<div>
							<div className="header-rand">{SearchBar({ ...props.searchProps })}</div>
							<div className="container container-custom" style={{ overflowAnchor: "none" }}>
								<Fade duration={600}>
									<BootstrapTable {...props.baseProps} selectRow={selectRow} sort={sortMode} classes={dark ? "dark-table" : ""} />
								</Fade>
							</div>
						</div>
					)}
				</ToolkitProvider>
			)}
			<ToastContainer />
			<NoteSection />
		</>
	);
}

function RandomButton({ data }) {
	let min = 0;
	let max = data.questions.length - 1;
	const [rnd, setRnd] = useState(Math.floor(Math.random() * (max - min)) + min);
	function pickRandomHandler() {
		setRnd(Math.floor(Math.random() * (max - min)) + min);
	}
	return (
		<Button
			className="pick-random-btn"
			onClick={pickRandomHandler}
			variant="outline-primary"
			href={data.questions[rnd].URL}
			target="_blank"

		>
			Pick a Random Question{" "}
		</Button>
	);
}
